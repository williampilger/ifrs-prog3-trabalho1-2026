import type { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function areasRoutes(app: FastifyInstance) {

    app.get('/areas', async (request: FastifyRequest, reply) => {

        const areas = await prisma.area.findMany({
            orderBy: { nome: 'asc' },
        });

        reply.send(areas);
    });

}