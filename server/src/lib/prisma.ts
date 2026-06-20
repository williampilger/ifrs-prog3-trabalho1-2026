import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../../generated/prisma/client.js";
import ENV from "./environmentConstants.js";
import { LogSystem } from "./LogSystem.js";

const adapter = new PrismaLibSql({ url: ENV.DATABASE_URL });

export const prisma = new PrismaClient({
    adapter,
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
