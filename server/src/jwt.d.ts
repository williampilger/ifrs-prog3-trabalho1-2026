import '@fastify/jwt'
import { PrivilegeTable } from './config/types'
import { jwtUserType } from './lib/authenticate'

export type jwtOfficeType = {
    id: number,
    privileges:PrivilegeTable
}

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: jwtUserType | undefined;
    }
}