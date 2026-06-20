import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { LogSystem } from "../lib/LogSystem.js";

export async function authRoutes(app: FastifyInstance) {

    app.get('/auth', async (request: FastifyRequest, reply) => {

        //verifica se o usuário está autenticado
        //Se a seção tiver uma licença, retorna ela junto. 
        // NÂO CRIA UMA LICENÇA SE NÂO HOUVER UMA
        if (request.user) {

            // const dbReg = await prisma.user.findFirst({
            //     where: {
            //         id: request.user.id,
            //         deletedAt: null
            //     }
            // });


            // if (dbReg) {


            //     return {
            //         user: dbReg
            //     };

            // } else {
            //     LogSystem.ERROR(2503125548, `Unable to locate this user locally (who was previously created, as they have logged in before)`, request);
            //     reply.code(500).send('2503125548 - Internal Server Error');
            // }

            //TODO FALTA IMPLEMENTARRR

            reply.code(501).send('METHOD NOT IMPLEMENTED!');   


            reply.code(401).send({ msg: '250224105940 - unhandled response' });
        } else {
            reply.code(401).send({ msg: '241004121601 - not authenticated' });
        }
    });

    /**
     * Usuário informa login e senha pelo app (essa TENDE a ser a rota MENOS comum, pois o usuário já chega autenticado até o app)
     */
    app.post('/auth/login', async (request: FastifyRequest, reply) => {

        const body = z.object({
            email: z.string(),
            password: z.string(),
        }).parse(request.body);

        if(request.user && request.user.id > 0){
            LogSystem.debug(250224101508, `User already authenticated, no need to login again`, request);
            reply.code(200).send({
                msg: 'you are already logged in',
            });
            return;
        }
        
        //TODO FALTA IMPLEMENTARRR

        reply.code(501).send('METHOD NOT IMPLEMENTED!');        
    });

    /**
     * Destrói a session do usuário, neste app, E NO DOMÍNIO COMO UM TODO
     */
    app.get('/auth/logout', async (request: FastifyRequest, reply) => {

        //fazer logout no domínio todo!!

        LogSystem.ERROR(240930152006, 'METHOD NOT IMPLEMENTED!', request);
        reply.code(501).send('METHOD NOT IMPLEMENTED!');
    });

}