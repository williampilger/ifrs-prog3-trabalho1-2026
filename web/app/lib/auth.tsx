import { createContext, useContext, useEffect, useState } from "react";
import API, { type Usuario } from "../api/api";

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
            const r = await API.auth.check();
            if (r.success && r.data?.usuario) {
                setUsuario(r.data.usuario);
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
            await API.auth.logout();
        } catch {
            // ignora erro de rede no logout
        }
        setUsuario(null);
    }

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

export type { Usuario };
