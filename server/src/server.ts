import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastify, { type FastifyError, type FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { LogSystem } from './lib/LogSystem.js';
import { jwtUserSchema, jwtVerify } from './lib/authenticate.js';
import ENV from './lib/environmentConstants.js';
import { netTestReport } from './lib/netTools.js';
import { prisma } from './lib/prisma.js';
import { buildRandomString, tryCatchErrorStringify } from './lib/tools.js';
import { AccountsRoutes } from './routes/account.js';
import { areasRoutes } from './routes/areas.js';
import { authRoutes } from './routes/auth.js';
import { beneficiosRoutes } from './routes/beneficios.js';
import { vagasRoutes } from './routes/vagas.js';

const app = fastify({
    logger: false
});


app.register(fastifyCookie);
app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'authorization', "pin1"], // Permitir cabeçalhos específicos
    credentials: true
});

app.register(jwt, {
    secret: ENV.JWT_SECRET, // use de .env ou o dfault se tá preenchido la
    cookie: {
        cookieName: 'token',
        signed: false
    }
});


app.addHook('onRequest', (request: FastifyRequest, reply, done) => {
    request.startTime = process.hrtime();
    request.ini_timestamp = Date.now() / 1000;//timestamp em SEGUNDOS
    request.reqID = buildRandomString(5);
    reply.header('reqID', request.reqID);//só pra ter a info no FrontEnd... pra fins de depuração
    reply.header('Access-Control-Expose-Headers','authorization, pin1');//O axios, no frontend não vai expor o header à aplicação se não tiver esse header
    LogSystem.debug(250515155736, '🔵 RequestStart', request);
    done();
});
app.addHook('preHandler', async (request: FastifyRequest, reply) => {

    if( await jwtVerify(request, true) ){

        if( request.user ){
            
            const parseResult = jwtUserSchema.safeParse(request.user);// Validação do conteúdo do JWT usando Zod

            //TODO colocar essas informações reorganizadas na request, instanciando o usuário 
    
        } else {
            //not authenticated, it's ok, just log it
            LogSystem.trace(250515161532, 'User not authenticated, moving forward', request);
        }

    } else {
        //not authenticated, anymore... It is a JWT, but it is not valid 
        LogSystem.trace(250515161533, `User not authenticated, moving forward`, request);
    }

});
app.addHook('onSend', (request: FastifyRequest, reply, payload,done) => {
    const [seconds, nanoseconds] = process.hrtime(request.startTime);
    const responseTimeInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    const isSuccess = reply.statusCode >= 200 && reply.statusCode < 300;
    const isServerError = reply.statusCode >= 500 && reply.statusCode < 600;
    
    // Captura a mensagem da resposta, se existir
    let responseMsg: string | undefined = undefined;
    if (typeof payload === 'object' && payload !== null && 'msg' in payload) {
        responseMsg = (payload as any).msg.split(' -')[0];
        if( responseMsg==='' ) responseMsg = undefined; // Se a mensagem for vazia, não exibir
    }
    
    LogSystem.info(250515155829, `${isSuccess ? '🟢' : (isServerError ? '🔴' : '🟡')} RequestEnd: [${request.method}] ${request.url} - ${reply.statusCode}${(!isSuccess && responseMsg) ? `(${responseMsg})` : ''} - ${responseTimeInMs}ms`, request);
    done();
});

app.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply) => {

    const statusCode = error.statusCode ?? 500;

    if (error instanceof ZodError) {
        LogSystem.error(250515155929, `Zod Validation error: ${JSON.stringify(error.issues)}`, request);

        // Converte as issues do Zod (array) num objeto { campo: mensagem },
        // pronto para o frontend exibir o erro abaixo de cada campo.
        // Mantém apenas a primeira mensagem por campo.
        const erros: Record<string, string> = {};
        for (const issue of error.issues) {
            const campo = issue.path.join(".");
            if (campo && !erros[campo]) erros[campo] = issue.message;
        }

        reply.status(422).send({
            message: "Zod Validation error",
            erros,
            issues: error.issues,
        });
        return;
    }

    LogSystem.ERROR(250515155930, JSON.stringify({
        error: tryCatchErrorStringify(error),
        url: request.url,
        method: request.method,
        params: request.params,
        body: request.body,
        headers: request.headers,
        user: request.user,
        reqID: request.reqID
    }), request);

    if (ENV.SUPPRESS_RESPONSE_ERROR_MESSAGES) {
        reply.status(500).send(`Code 250515155931:${request.reqID} - Internal Server Error - Contact the Support Team for more Information`);
    } else {

        if (statusCode < 400) {
            LogSystem.ERROR(250515160000, `Status 500 was returned instead of ${statusCode} - ${error.message}`, request);
            reply.status(500).send(`Code 250515155931:${request.reqID} - Internal Server Error`);
        } else {
            reply.status(statusCode).send({
                message: error.message,
                validation: error.validation,
                stack: error.stack
            });
        }
    }
});

app.register(authRoutes);
app.register(AccountsRoutes);
app.register(areasRoutes);
app.register(beneficiosRoutes);
app.register(vagasRoutes);

app.get('/', () => {
    return {
        status: ENV.SERVER_UNDER_MAINTENANCE ? 'Server under maintenance - running in read-only mode' : "Server is running!",
        author: "Felipe Ledur | William Pilger"
    };
});

async function main() {

    async function connectWithRetry() {
        for (let i = 0; i < 5; i++) {
            try {
                await prisma.$connect();
                LogSystem.info(250515160422, "✅ Conectado ao banco!", null);
                return;
            } catch (error) {
                LogSystem.error(250515160423, `❌ Erro na conexão (${i + 1}/5): ${tryCatchErrorStringify(error)}`, null);
                await new Promise(res => setTimeout(res, 1000));
            }
        }

        LogSystem.fatal(250515160424, "Database is not accessible", null);
        LogSystem.info(250515160425, "Starting network connection test", null);
        
        await netTestReport();

        await LogSystem.fatal(250515160426, "🛑 Stopping server", null);//await só pra garantir que o log será feito ainda
        process.exit(1);
    }
    
    await connectWithRetry();

    await app.listen({
        port: ENV.PORT,
        host: '0.0.0.0'
    }).then(() => {
        LogSystem.INFO(260515160427, `Server is running on port ${ENV.PORT}`, null);
    });
}

main();