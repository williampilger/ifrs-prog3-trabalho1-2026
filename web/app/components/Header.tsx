import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdLogout, MdPerson } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../lib/auth";

function iniciaisDoNome(nome: string) {
    const partes = nome.trim().split(/\s+/);
    const primeira = partes[0]?.[0] ?? "";
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
}

export default function Header() {
    const { usuario, carregando, logout } = useAuth();
    const [aberto, setAberto] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!aberto) return;
        function handleClickFora(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, [aberto]);

    async function handleLogout() {
        setAberto(false);
        await logout();
        navigate("/");
    }

    return (
        <header className="bg-background border-b border-border flex items-center justify-between px-8 py-5">
            <Link
                to="/"
                className="text-lg font-bold text-primary flex items-center gap-2"
            >
                <img
                    src="/images/ifrs-logo-verde.png"
                    alt="Logo Ifrs"
                    width={40}
                    height={40}
                    style={{ height: "auto" }}
                />
                Sistema de Estágios
            </Link>

            {!carregando && usuario ? (
                <div className="relative" ref={ref}>
                    <button
                        onClick={() => setAberto((v) => !v)}
                        className="flex items-center gap-2"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                            {iniciaisDoNome(usuario.nome)}
                        </span>
                        <span className="text-sm font-medium text-text-primary">{usuario.nome}</span>
                        <MdKeyboardArrowDown className="text-text-muted" />
                    </button>
                    {aberto && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-white py-1 shadow-md">
                            <Link
                                to="/perfil"
                                onClick={() => setAberto(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background-alt"
                            >
                                <MdPerson size={18} />
                                Editar Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-background-alt"
                            >
                                <MdLogout size={18} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            ) : !carregando ? (
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm text-primary font-medium">
                        Login
                    </Link>
                    <Link
                        to="/cadastro"
                        className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                    >
                        Cadastrar
                    </Link>
                </div>
            ) : null}
        </header>
    );
}
