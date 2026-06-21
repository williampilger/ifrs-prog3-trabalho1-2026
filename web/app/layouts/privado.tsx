import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../lib/auth";

export default function PrivadoLayout() {
    const { usuario, carregando } = useAuth();
    const navigate = useNavigate();

    // Quando a verificação termina e não há usuário, manda para o login.
    useEffect(() => {
        if (!carregando && !usuario) {
            navigate("/login");
        }
    }, [carregando, usuario, navigate]);

    // Enquanto verifica (ou já decidiu redirecionar), não renderiza a área privada.
    if (carregando || !usuario) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-alt">
                <p className="text-text-muted">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-alt">
            <Header />
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}