import type { FastifyInstance, FastifyRequest } from "fastify";
import z from "zod";
import { LogSystem } from "../lib/LogSystem.js";
import { prisma } from "../lib/prisma.js";

const paramsId = z.object({ id: z.coerce.number().int().positive() });

const bodyVaga = z.object({
    titulo: z.string().min(3, "Título deve ter ao menos 3 caracteres."),
    curso: z.string().min(1, "Selecione um curso."),
    turno: z.enum(["integral", "manha", "tarde", "noite"]),
    modalidade: z.enum(["presencial", "remoto", "hibrido"]),
    descricaoAtividades: z.string().min(10, "Descrição de atividades deve ter ao menos 10 caracteres."),
    descricaoHabilidades: z.string().optional().default(""),
    salario: z.number().positive().nullable().optional(),
    local: z.string().optional(),
    contatoNome: z.string().optional(),
    contatoTelefone: z.string().optional(),
    contatoEmail: z.union([z.string().email(), z.literal("")]).optional(),
    beneficios: z.array(z.string().min(1)).optional().default([]),
});

async function resolverBeneficios(nomes: string[]) {
    return Promise.all(
        nomes.map((nome) =>
            prisma.beneficio.upsert({
                where: { nome },
                update: {},
                create: { nome },
                select: { id: true },
            })
        )
    );
}

export async function vagasRoutes(app: FastifyInstance) {

    app.get("/vagas", async (request: FastifyRequest, reply) => {
        if (!request.user) return reply.code(401).send({ mensagem: "Não autenticado." });
        if (request.user.tipo !== "empresa") return reply.code(403).send({ mensagem: "Apenas empresas podem listar suas vagas." });

        const vagas = await prisma.vaga.findMany({
            where: { empresaId: request.user.id, excluidoEm: null },
            include: { area: true },
            orderBy: { criadoEm: "desc" },
        });

        reply.send({ vagas });
    });

    app.get("/vagas/:id", async (request: FastifyRequest, reply) => {
        const { id } = paramsId.parse(request.params);

        const vaga = await prisma.vaga.findFirst({
            where: { id, excluidoEm: null },
            include: {
                area: true,
                empresa: { select: { id: true, nome: true } },
                beneficios: { include: { beneficio: true } },
            },
        });

        if (!vaga) return reply.code(404).send({ mensagem: "Vaga não encontrada." });

        reply.send({ vaga });
    });

    app.post("/vagas", async (request: FastifyRequest, reply) => {
        
        if (!request.user) return reply.code(401).send({ mensagem: "Não autenticado." });
        if (request.user.tipo !== "empresa") return reply.code(403).send({ mensagem: "Apenas empresas podem criar vagas." });

        const body = bodyVaga.parse(request.body);

        const area = await prisma.area.upsert({
            where: { nome: body.curso },
            update: {},
            create: { nome: body.curso },
        });

        const beneficiosIds = await resolverBeneficios(body.beneficios);
        const descricao = [body.descricaoAtividades, body.descricaoHabilidades].filter(Boolean).join("\n\n");

        const vaga = await prisma.vaga.create({
            data: {
                titulo: body.titulo,
                descricao,
                areaId: area.id,
                empresaId: request.user.id,
                turno: body.turno,
                modalidade: body.modalidade,
                salario: body.salario ?? null,
                local: body.local ?? null,
                contatoNome: body.contatoNome ?? null,
                contatoTelefone: body.contatoTelefone ?? null,
                contatoEmail: body.contatoEmail || null,
                beneficios: {
                    create: beneficiosIds.map((b) => ({ beneficioId: b.id })),
                },
            },
            include: {
                area: true,
                beneficios: { include: { beneficio: true } },
            },
        });

        LogSystem.info(260621001001, `Vaga criada: id=${vaga.id} empresa=${request.user.id}`, request);
        reply.code(201).send({ mensagem: "Vaga criada com sucesso.", vaga });
    });

    app.put("/vagas/:id", async (request: FastifyRequest, reply) => {
        if (!request.user) return reply.code(401).send({ mensagem: "Não autenticado." });

        const { id } = paramsId.parse(request.params);
        const body = bodyVaga.parse(request.body);

        const vaga = await prisma.vaga.findFirst({ where: { id, excluidoEm: null } });
        if (!vaga) return reply.code(404).send({ mensagem: "Vaga não encontrada." });
        if (vaga.empresaId !== request.user.id) return reply.code(403).send({ mensagem: "Sem permissão para editar esta vaga." });

        const area = await prisma.area.upsert({
            where: { nome: body.curso },
            update: {},
            create: { nome: body.curso },
        });

        const beneficiosIds = await resolverBeneficios(body.beneficios);
        const descricao = [body.descricaoAtividades, body.descricaoHabilidades].filter(Boolean).join("\n\n");

        const vagaAtualizada = await prisma.vaga.update({
            where: { id },
            data: {
                titulo: body.titulo,
                descricao,
                areaId: area.id,
                turno: body.turno,
                modalidade: body.modalidade,
                salario: body.salario ?? null,
                local: body.local ?? null,
                contatoNome: body.contatoNome ?? null,
                contatoTelefone: body.contatoTelefone ?? null,
                contatoEmail: body.contatoEmail || null,
                beneficios: {
                    deleteMany: {},
                    create: beneficiosIds.map((b) => ({ beneficioId: b.id })),
                },
            },
            include: {
                area: true,
                beneficios: { include: { beneficio: true } },
            },
        });

        LogSystem.info(260621001002, `Vaga atualizada: id=${vagaAtualizada.id}`, request);
        reply.send({ mensagem: "Vaga atualizada com sucesso.", vaga: vagaAtualizada });
    });

    app.delete("/vagas/:id", async (request: FastifyRequest, reply) => {
        if (!request.user) return reply.code(401).send({ mensagem: "Não autenticado." });

        const { id } = paramsId.parse(request.params);

        const vaga = await prisma.vaga.findFirst({ where: { id, excluidoEm: null } });
        if (!vaga) return reply.code(404).send({ mensagem: "Vaga não encontrada." });
        if (vaga.empresaId !== request.user.id) return reply.code(403).send({ mensagem: "Sem permissão para remover esta vaga." });

        await prisma.vaga.update({ where: { id }, data: { excluidoEm: new Date() } });

        LogSystem.info(260621001003, `Vaga removida (soft delete): id=${id}`, request);
        reply.send({ mensagem: "Vaga removida com sucesso." });
    });

    app.patch("/vagas/:id/status", async (request: FastifyRequest, reply) => {
        if (!request.user) return reply.code(401).send({ mensagem: "Não autenticado." });

        const { id } = paramsId.parse(request.params);
        const { preenchida } = z.object({ preenchida: z.boolean() }).parse(request.body);

        const vaga = await prisma.vaga.findFirst({ where: { id, excluidoEm: null } });
        if (!vaga) return reply.code(404).send({ mensagem: "Vaga não encontrada." });
        if (vaga.empresaId !== request.user.id) return reply.code(403).send({ mensagem: "Sem permissão para alterar o status desta vaga." });

        const vagaAtualizada = await prisma.vaga.update({
            where: { id },
            data: { preenchida },
        });

        LogSystem.info(260621001004, `Vaga ${vagaAtualizada.preenchida ? "preenchida" : "reaberta"}: id=${id}`, request);
        reply.send({
            mensagem: `Vaga marcada como ${vagaAtualizada.preenchida ? "preenchida" : "aberta"}.`,
            vaga: vagaAtualizada,
        });
    });
}
