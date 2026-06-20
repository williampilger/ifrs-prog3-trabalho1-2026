import type { FastifyRequest } from "fastify";

export function buildRandomString(length: number, type: 'hexa'|'alpha' = 'hexa'): string {
    const characters = type==='hexa' ? '0123456789ABCDEF' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export function cleanObject(obj: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
}

export function tryCatchErrorStringify(error: unknown, request?: FastifyRequest): string {
    return JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        requestDetails: request ? {
            method: request.method,
            url: request.url,
            headers: request.headers
        } : undefined
    });
}