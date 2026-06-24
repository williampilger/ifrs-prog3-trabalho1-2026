import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../lib/auth";

export default function PrivadoAlunoLayout() {
    const { usuario, carregando } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!carregando) {
            if (!usuario) {
                navigate("/login");
            } else if (usuario.tipo !== "aluno") {
                navigate("/empresa");
            }
        }
    }, [carregando, usuario, navigate]);

    if (carregando || !usuario || usuario.tipo !== "aluno") {
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
