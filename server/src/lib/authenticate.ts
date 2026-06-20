import type { FastifyInstance, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { LogSystem } from "./LogSystem.js";
import ENV from "./environmentConstants.js";
import { tryCatchErrorStringify } from "./tools.js";

export type jwtUserType = {
    id: number,
    username: string
}

export const jwtUserSchema = z.object({
    // JWT DEFAULT FIELDS
    sub: z.string().optional(), // Subject of the JWT, usually the user ID
    iat: z.number().optional(), // Issued at time
    exp: z.number().optional(), // Expiration time
    // CUSTOM FIELDS
    id: z.number(),
    username: z.string(),
}).strict();

export async function jwtVerify(request:FastifyRequest, tryRenew:boolean=true):Promise<boolean> {
    try {
        await request.jwtVerify()
        return true;
    } catch (error) {
        if(tryRenew){
            try {
                const token = request.headers.authorization?.replace('Bearer ', '');
                if(token){
                    const decodedToken = jwt.verify(token, ENV.JWT_SECRET, {ignoreExpiration: true})
                    if(decodedToken){
                        //TODO Verificar o SSID no servidor novamente, se estiver tudo OK, assina um novo JWT
                        LogSystem.error(250530140100, `JWT recycling not implemented yet!!!`, request);
                        return false;
                    }
                }
                await request.jwtVerify()
            } catch (error) {
                LogSystem.warn(250530140101, `JWT verification and recycling failed. Error: ${tryCatchErrorStringify(error)}`, request);
            }
        }else{
            LogSystem.warn(250530140102, `JWT verification failed and it will not be recycled. Error: ${tryCatchErrorStringify(error)}`, request);
        }
    }
    return false;
}

export async function jwtSign(app:FastifyInstance, user:jwtUserType) {
    return app.jwt.sign(
        user,
        {
            sub: user.id.toString(),
            expiresIn: ENV.JWT_EXPIRES_IN
        }
    );
}