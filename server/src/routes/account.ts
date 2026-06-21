import { createHash } from "crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import z from "zod";
import { LogSystem } from "../lib/LogSystem.js";
import { prisma } from "../lib/prisma.js";

const md5 = (s: string) => createHash("md5").update(s).digest("hex");

function validarCamposTipo(tipo: string, nascimento: string | undefined, cnpj: string | undefined, ctx: z.RefinementCtx) {
    if (tipo === "aluno" && !nascimento) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nascimento"], message: "Data de nascimento é obrigatória para alunos." });
    }
    if (tipo === "empresa" && !cnpj) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cnpj"], message: "CNPJ é obrigatório para empresas." });
    }
}

export async function AccountsRoutes(app: FastifyInstance) {

    app.post('/cadastro', async (request: FastifyRequest, reply) => {

        const body = z.object({
            nome: z.string().min(2),
            email: z.string().email(),
            senha: z.string().min(6),
            telefone: z.string().optional(),
            tipo: z.enum(["aluno", "empresa"]),
            nascimento: z.string().optional(),
            curso: z.string().optional(),
            cnpj: z.string().optional(),
        }).superRefine((data, ctx) => {
            validarCamposTipo(data.tipo, data.nascimento, data.cnpj, ctx);
        }).parse(request.body);

        const existe = await prisma.usuario.findFirst({
            where: { email: body.email, excluidoEm: null },
        });

        if (existe) {
            LogSystem.warn(260621000001, `Tentativa de cadastro com email já existente: ${body.email}`, request);
            reply.code(409).send({ mensagem: "Este e-mail já está em uso." });
            return;
        }

        const usuario = await prisma.usuario.create({
            data: {
                nome: body.nome,
                email: body.email,
                pswd: md5(body.senha),
                telefone: body.telefone ?? null,
                tipo: body.tipo,
                nascimento: body.nascimento ?? null,
                curso: body.curso ?? null,
                cnpj: body.cnpj ?? null,
            },
            select: { id: true, nome: true, email: true, tipo: true },
        });

        LogSystem.info(260621000002, `Novo usuário criado: id=${usuario.id} tipo=${usuario.tipo}`, request);
        reply.code(201).send({ mensagem: "Conta criada com sucesso.", usuario });
    });

    app.get('/perfil', async (request: FastifyRequest, reply) => {

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
                nascimento: true,
                curso: true,
                cnpj: true,
            },
        });

        if (!usuario) {
            reply.code(401).send({ mensagem: "Não autenticado." });
            return;
        }

        reply.send({ usuario });
    });

    app.put('/perfil', async (request: FastifyRequest, reply) => {

        if (!request.user) {
            reply.code(401).send({ mensagem: "Não autenticado." });
            return;
        }

        const tipo = request.user.tipo;

        const body = z.object({
            nome: z.string().min(2),
            email: z.string().email(),
            // string vazia = manter senha atual; não enviado = idem
            senha: z.preprocess(v => (v === "" ? undefined : v), z.string().min(6).optional()),
            telefone: z.string().optional(),
            nascimento: z.string().optional(),
            curso: z.string().optional(),
            cnpj: z.string().optional(),
        }).superRefine((data, ctx) => {
            validarCamposTipo(tipo, data.nascimento, data.cnpj, ctx);
        }).parse(request.body);

        if (body.email !== request.user.username) {
            const existe = await prisma.usuario.findFirst({
                where: { email: body.email, excluidoEm: null },
            });
            if (existe) {
                reply.code(409).send({ mensagem: "Este e-mail já está em uso." });
                return;
            }
        }

        const atualizado = await prisma.usuario.update({
            where: { id: request.user.id },
            data: {
                nome: body.nome,
                email: body.email,
                telefone: body.telefone ?? null,
                // só inclui o campo se veio no body; undefined = Prisma não toca no valor atual
                // ...(body.nascimento !== undefined ? { nascimento: body.nascimento } : {}),
                ...(body.curso !== undefined ? { curso: body.curso || null } : {}),
                ...(body.cnpj !== undefined ? { cnpj: body.cnpj } : {}),
                ...(body.senha ? { pswd: md5(body.senha) } : {}),
            },
            select: { id: true, nome: true, email: true, tipo: true },
        });

        LogSystem.info(260621000003, `Perfil atualizado: id=${atualizado.id}`, request);
        reply.send({ mensagem: "Perfil atualizado com sucesso.", usuario: atualizado });
    });

}
