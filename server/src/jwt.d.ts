import '@fastify/jwt'
import { jwtUserType } from './lib/authenticate'

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: jwtUserType | undefined;
    }
}