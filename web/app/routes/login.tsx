import { useState } from "react";
import { MdSchool, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import Campo from "../components/Campo";
import Card from "../components/Card";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erros, setErros] = useState<Record<string, string>>({});
    const [erroGeral, setErroGeral] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    const { recarregar } = useAuth();

    async function handleSubmit() {
        setErros({});
        setErroGeral("");

        try {
            const resposta = await api("/login", {
                method: "POST",
                body: JSON.stringify({ email, senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                if (dados.erros) {
                    setErros(dados.erros);
                } else {
                    setErroGeral(dados.mensagem ?? "Não foi possível entrar.");
                }
                return;
            }

            // Login OK: o cookie já foi setado pelo backend.
            // Recarrega o contexto de auth para saber quem é e redireciona.
            await recarregar();

            const respAuth = await api("/auth");
            const dadosAuth = await respAuth.json();
            const tipo = dadosAuth?.usuario?.tipo;

            navigate(tipo === "empresa" ? "/empresa" : "/aluno");
        } catch {
            setErroGeral("Erro de conexão com o servidor.");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen w-full px-4">
            <div className="flex flex-col items-center w-full max-w-md">
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-primary rounded-lg p-2 w-fit">
                        <MdSchool className="fill-white block" size={30} />
                    </div>
                    <h1 className="text-2xl font-bold text-primary">Sistema de Estágios</h1>
                    <span className="text-xs uppercase tracking-widest text-text-muted">
                        IFRS Campus Feliz
                    </span>
                </div>
                <Card className="mt-6 w-full bg-background border border-border">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <Campo
                            label="Email"
                            type="email"
                            placeholder="seu.nome@aluno.feliz.ifrs.edu.br"
                            value={email}
                            onChange={setEmail}
                            erro={erros.email}
                        />
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-text-primary">Senha</label>
                                <a href="/recuperar-senha" className="text-sm font-medium text-red-700">
                                    Esqueci minha senha
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full rounded-md border border-border px-4 py-2 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary"
                                >
                                    {mostrarSenha ? <MdVisibilityOff /> : <MdVisibility />}
                                </button>
                            </div>
                            {erros.senha && <p className="text-xs text-red-600">{erros.senha}</p>}
                        </div>

                        {erroGeral && (
                            <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
                                {erroGeral}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="mt-2 rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                        >
                            Entrar
                        </button>
                        <p className="mt-5 text-center text-sm text-text-muted">
                            Não possui uma conta?{" "}
                            <Link to="/cadastro" className="font-medium text-primary">Crie sua conta</Link>
                        </p>
                    </form>
                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-text-muted">OU</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-text-primary hover:bg-background-alt transition-colors">
                        Entrar com Google
                    </button>
                </Card>
            </div>
        </div>
    );
}