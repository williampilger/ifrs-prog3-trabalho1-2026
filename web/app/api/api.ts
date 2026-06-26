import axios from 'axios';
import type { Aluno, Empresa, Usuario, Vaga } from './types';

const API_URL = "http://localhost:3000";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

export type resultType<T> = {
    conex: boolean;
    reqStat: number;
    success: boolean;
    data: T;
    msg: string;
};

const buildParamString = (params: Record<string, any>): string => {
    const keys = Object.keys(params);
    if (keys.length === 0) return '';
    return '?' + keys.map(k => `${k}=${params[k]}`).join('&');
};

const basicFetch = async (
    method: string,
    endpoint: string,
    params: object,
    options?: { headers?: Record<string, string> }
): Promise<resultType<any>> => {
    const result = { conex: true, reqStat: 0, success: false, data: null as any, msg: '' };
    try {
        const headers: any = options?.headers ?? {};
        let r: any;
        switch (method) {
            case 'POST':
                r = await axiosInstance.post(endpoint, params, { validateStatus: () => true, headers });
                break;
            case 'GET':
                r = await axiosInstance.get(`${endpoint}${buildParamString(params as any)}`, { validateStatus: () => true, headers });
                break;
            case 'PUT':
                r = await axiosInstance.put(endpoint, params, { validateStatus: () => true, headers });
                break;
            case 'DELETE':
                r = await axiosInstance.delete(`${endpoint}${buildParamString(params as any)}`, { validateStatus: () => true, headers });
                break;
            case 'PATCH':
                r = await axiosInstance.patch(endpoint, params, { validateStatus: () => true, headers });
                break;
            default:
                throw new Error('method not allowed');
        }
        if (r) {
            result.reqStat = r.status;
            result.success = r.status === 200 || r.status === 201;
            if (r.data !== undefined) result.data = r.data;
            result.msg = r.data?.msg ?? '';
        } else {
            result.conex = false;
            result.msg = 'connection error';
        }
    } catch {
        result.conex = false;
        result.msg = 'connection error';
    }
    return result;
};

// Monta o corpo da requisição de vaga: converte os benefícios para nomes
// e remove os campos opcionais que estão null (o backend espera string ou
// ausência do campo — não aceita null nos opcionais).
const montarBodyVaga = (dados: Vaga) => {
    const body: Record<string, any> = {
        ...dados,
        beneficios: (dados.beneficios ?? []).map((b) => b.nome),
    };
    for (const campo of ['local', 'salario', 'contatoNome', 'contatoTelefone', 'contatoEmail']) {
        if (body[campo] === null) delete body[campo];
    }
    return body;
};

const api_exports = {

    auth: {
        check: async (cookie?: string): Promise<resultType<{ usuario?: Usuario }>> => {
            const headers = cookie ? { Cookie: cookie } : undefined;
            return basicFetch('GET', '/auth', {}, { headers });
        },
        login: async (email: string, senha: string): Promise<resultType<{ erros?: Record<string, string>; mensagem?: string }>> => {
            return basicFetch('POST', '/login', { email, senha });
        },
        logout: async (): Promise<resultType<{}>> => {
            return basicFetch('GET', '/logout', {});
        },
    },

    cadastro: {
        criar: async (dados: Partial<Aluno | Empresa> & { senha: string }): Promise<resultType<{ erros?: Record<string, string>; mensagem?: string }>> => {
            return basicFetch('POST', '/cadastro', dados);
        },
    },

    vagas: {
        list: async (): Promise<resultType<{ vagas: any[] }>> => {
            return basicFetch('GET', '/vagas', {});
        },
        listDisponiveis: async (): Promise<resultType<{ vagas: any[] }>> => {
            return basicFetch('GET', '/vagas/disponiveis', {});
        },
        get: async (id: string | number): Promise<resultType<{ vaga: any }>> => {
            return basicFetch('GET', `/vagas/${id}`, {});
        },
        create: async (dados: Vaga): Promise<resultType<{ erros?: Record<string, string>; mensagem?: string }>> => {
            return basicFetch('POST', '/vagas', montarBodyVaga(dados));
        },
        update: async (id: string | number, dados: Vaga): Promise<resultType<{ erros?: Record<string, string>; mensagem?: string }>> => {
            return basicFetch('PUT', `/vagas/${id}`, montarBodyVaga(dados));
        },
        updateStatus: async (id: string | number, preenchida: boolean): Promise<resultType<{ mensagem?: string }>> => {
            return basicFetch('PATCH', `/vagas/${id}/status`, { preenchida });
        },
        remove: async (id: string | number): Promise<resultType<{ mensagem?: string }>> => {
            return basicFetch('DELETE', `/vagas/${id}`, {});
        },
    },

    beneficios: {
        list: async (): Promise<resultType<{ id: number; nome: string }[]>> => {
            return basicFetch('GET', '/beneficios', {});
        },
    },

    areas: {
        list: async (): Promise<resultType<{ id: number; nome: string }[]>> => {
        return basicFetch('GET', '/areas', {});
        },
    },

    perfil: {
        get: async (cookie?: string): Promise<resultType<{ usuario: Usuario }>> => {
            const headers = cookie ? { Cookie: cookie } : undefined;
            return basicFetch('GET', '/perfil', {}, { headers });
        },
        update: async (dados: Partial<Usuario & { senha?: string }>): Promise<resultType<{ erros?: Record<string, string>; mensagem?: string }>> => {
            return basicFetch('PUT', '/perfil', dados);
        },
    },
};

export default api_exports;