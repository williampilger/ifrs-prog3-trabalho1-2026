import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

export type Usuario = {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
    tipo: "aluno" | "empresa";
};

type AuthContextType = {
    usuario: Usuario | null;
    carregando: boolean;
    recarregar: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);

    async function recarregar() {
        try {
            const resposta = await api("/auth");
            if (resposta.ok) {
                const dados = await resposta.json();
                setUsuario(dados.usuario);
            } else {
                setUsuario(null);
            }
        } catch {
            setUsuario(null);
        } finally {
            setCarregando(false);
        }
    }

    async function logout() {
        try {
            await api("/logout");
        } catch {
            // ignora erro de rede no logout
        }
        setUsuario(null);
    }

    // Roda só no cliente (no SSR o useEffect não executa), buscando o usuário
    // a partir do cookie httpOnly que o navegador envia automaticamente.
    useEffect(() => {
        recarregar();
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, carregando, recarregar, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return contexto;
}