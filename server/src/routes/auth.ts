import { createHash } from "crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { jwtSign } from "../lib/authenticate.js";
import { LogSystem } from "../lib/LogSystem.js";
import { prisma } from "../lib/prisma.js";

const md5 = (s: string) => createHash("md5").update(s).digest("hex");

export async function authRoutes(app: FastifyInstance) {

    /**
     * Login: valida email/senha, assina o JWT e o coloca num cookie httpOnly.
     */
    app.post('/login', async (request: FastifyRequest, reply) => {

        const { email, senha } = z.object({
            email: z.string().email(),
            senha: z.string().min(1),
        }).parse(request.body);

        // Busca o usuário ativo (ignora contas excluídas via soft delete)
        const usuario = await prisma.usuario.findFirst({
            where: { email, excluidoEm: null },
        });

        // Mensagem genérica: não revela se foi o email ou a senha que falhou
        if (!usuario || usuario.pswd !== md5(senha)) {
            LogSystem.warn(250620000001, `Login falhou para o email: ${email}`, request);
            reply.code(401).send({ mensagem: "Email ou senha inválidos." });
            return;
        }

        const token = await jwtSign(app, {
            id: usuario.id,
            username: usuario.email,
            nome: usuario.nome,
            tipo: usuario.tipo,
        });

        reply.setCookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        reply.send({ mensagem: "Login realizado com sucesso." });
    });

    /**
     * Retorna os dados do usuário autenticado (o front chama após o login
     * para saber quem está logado e para qual área redirecionar).
     */
    app.get('/auth', async (request: FastifyRequest, reply) => {

        if (!request.user) {
            reply.code(401).send({ mensagem: "Não autenticado." });
            return;
        }

        const usuario = await prisma.usuario.findFirst({
            where: { id: request.user.id, excluidoEm: null },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                tipo: true,
            },
        });

        if (!usuario) {
            LogSystem.error(250620000002, `Usuário do token não encontrado no banco (id: ${request.user.id})`, request);
            reply.code(401).send({ mensagem: "Não autenticado." });
            return;
        }

        reply.send({ usuario });
    });

    /**
     * Logout: remove o cookie do token.
     */
    app.get('/logout', async (request: FastifyRequest, reply) => {
        reply.clearCookie('token', { path: '/' });
        reply.send({ mensagem: "Logout realizado." });
    });

}