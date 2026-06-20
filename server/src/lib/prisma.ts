import { PrismaClient } from "@prisma/client";
import { LogSystem } from "./LogSystem"; // ajuste o caminho conforme necessário

export const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
    ],
});

prisma.$on('info', (e) => {
    LogSystem.info(250528164105, e.message, null);
});
prisma.$on('warn', (e) => {
    LogSystem.warn(250528164106, e.message, null);
});
prisma.$on('error', (e) => {
    LogSystem.error(250528164107, e.message, null);
});