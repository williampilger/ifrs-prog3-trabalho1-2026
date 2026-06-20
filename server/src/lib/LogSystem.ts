import type { FastifyRequest } from "fastify";
import { appendFile } from 'fs/promises';
import pino from "pino";
import ENV from "./environmentConstants.js";

const logger = pino({
    level: ENV.LOG_LEVEL,
    ...(ENV.LOG_PRETTY ? {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
            }
        }
    } : {})
});

const CATEGORIES = [
    'TRACE',   // 0
    'DEBUG',   // 1
    'INFO',    // 2
    'WARNING', // 3
    'ERROR',   // 4
    'FATAL'    // 5
];

function parseBrowser(userAgent: string | undefined): string {
    if (!userAgent) return '';
    const browsers = [
        { name: 'Edge', regex: /Edg\/([\d.]+)/ },
        { name: 'Chrome', regex: /Chrome\/([\d.]+)/ },
        { name: 'Firefox', regex: /Firefox\/([\d.]+)/ },
        { name: 'Safari', regex: /Version\/([\d.]+).*Safari/ },
        { name: 'Opera', regex: /OPR\/([\d.]+)/ },
        { name: 'IE', regex: /MSIE ([\d.]+)/ }
    ];
    for (const b of browsers) {
        const match = userAgent.match(b.regex);
        if (match) return `${b.name} ${match[1] ?? ''}`;
    }
    return userAgent.split(' ')[0] ?? '';
}

function parseOS(userAgent: string | undefined): string {
    if (!userAgent) return '';
    const osList = [
        { name: 'Windows', regex: /Windows NT ([\d.]+)/ },
        { name: 'macOS', regex: /Mac OS X ([\d_]+)/ },
        { name: 'Linux', regex: /Linux ([^;)\s]*)/ },
        { name: 'Android', regex: /Android ([\d.]+)/ },
        { name: 'iOS', regex: /iPhone OS ([\d_]+)/ }
    ];
    for (const os of osList) {
        const match = userAgent.match(os.regex);
        if (match) {
            const version = (match[1] ?? '').replace(/_/g, '.');
            return `${os.name} ${version}`;
        }
    }
    return '';
}

const logFormat = (code: number, content: string, request: FastifyRequest | null) => {
    const browserInfo = parseBrowser(request?.headers['user-agent']);
    const osInfo =
        request?.headers['sec-ch-ua-platform-version']
            ? `${request.headers['sec-ch-ua-platform'] || ''} ${request.headers['sec-ch-ua-platform-version']}`
            : parseOS(request?.headers['user-agent']);

    return ENV.LOG_PRETTY ? `[${code}-${request?.reqID ?? 'X'}-${request?.method ?? 'X'}-${request?.user?.id ?? '0'}] ${content}` : {
        logCode: code,
        content,
        metadata: request && {
            requestId: request.reqID ?? '',
            endpoint: request.url,
            method: request.method,
            userId: request.user?.id,
            browser: browserInfo,
            ip: request.ip,
            system: osInfo,
            referer: request.headers['referer'] || request.headers['referrer'] || ''
        }
    };
};

const saveJsonToFile = async (data: unknown, filePath: string = 'out.log') => {
    if (!ENV.SAVE_LOG_TO_FILE) return;
    try {
        await appendFile(filePath, JSON.stringify(data) + '\n', 'utf8');
    } catch {}
};

export const LogSystem = {

    _log: async (category: number, code: number, message: string, request: FastifyRequest | null) => {
        const categoryName = CATEGORIES[category] as string;
        console.log(`LOCAL_LOG: ${categoryName}-${code}-${request?.reqID ?? 'SYSTEM'}: ${message} `.replace(/\\n/g, '\n'));
    },

    trace: async (code: number, content: string, request: FastifyRequest | null) => {
        logger.trace(logFormat(code, content, request));
        saveJsonToFile(logFormat(code, content, request));
    },

    debug: async (code: number, content: string, request: FastifyRequest | null) => {
        logger.debug(logFormat(code, content, request));
        saveJsonToFile(logFormat(code, content, request));
    },

    info: async (code: number, content: string, request: FastifyRequest | null) => {
        logger.info(logFormat(code, content, request));
        saveJsonToFile(logFormat(code, content, request));
    },

    INFO: async (code: number, content: string, request: FastifyRequest | null) => {
        LogSystem.info(code, content, request);
        saveJsonToFile(logFormat(code, content, request));
        //TODO enviar TAMBÉM para o sistema de monitoramento
    },

    warn: async (code: number, content: string, request: FastifyRequest | null) => {
        logger.warn(logFormat(code, content, request));
        saveJsonToFile(logFormat(code, content, request));
    },

    error: async (code: number, content: string, request: FastifyRequest | null) => {
        logger.error(logFormat(code, content, request));
        saveJsonToFile(logFormat(code, content, request));
    },

    ERROR: async (code: number, content: string, request: FastifyRequest | null) => {
        LogSystem.error(code, content, request);
        saveJsonToFile(logFormat(code, content, request));
        //TODO enviar TAMBÉM para o sistema de monitoramento
    },

    fatal: async (code: number, content: string, request: FastifyRequest | null) => {
        logger.fatal(logFormat(code, content, request));
        saveJsonToFile(logFormat(code, content, request));
        //TODO enviar TAMBÉM para o sistema de monitoramento
    }
};
