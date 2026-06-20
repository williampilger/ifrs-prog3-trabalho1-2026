export const API_URL = "http://localhost:3000";

// Helper: faz fetch já enviando o cookie (credentials) e tratando JSON.
export async function api(caminho: string, opcoes: RequestInit = {}) {
    return fetch(`${API_URL}${caminho}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(opcoes.headers ?? {}),
        },
        ...opcoes,
    });
}