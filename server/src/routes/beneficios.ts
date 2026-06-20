import type { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function beneficiosRoutes(app: FastifyInstance) {

    app.get('/beneficios', async (request: FastifyRequest, reply) => {

        const beneficios = await prisma.beneficio.findMany({
            orderBy: { nome: 'asc' },
        });

        reply.send(beneficios);
    });

}