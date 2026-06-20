import 'fastify';
import { jwtUserType } from '../lib/authenticate';
import { apiResponseType_license } from './api_types';

declare module 'fastify' {
    interface FastifyRequest {
        startTime: [number, number];
        ini_timestamp: number;
        reqID: string;
        license: apiResponseType_license | undefined;
    }
}

interface AuthenticatedRequest extends FastifyRequest {
    user: jwtUserType;
}