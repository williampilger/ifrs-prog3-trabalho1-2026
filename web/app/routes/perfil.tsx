import { useState } from "react";
import { MdArrowBack, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { redirect, useLoaderData, useNavigate } from "react-router";
import SelectCurso from "~/components/SelectCurso";
import Campo from "../components/Campo";
import Card from "../components/Card";
import { api } from "../lib/api";

type Usuario = {
    tipo: "aluno" | "empresa";
    nome: string;
    email: string;
    telefone: string;
    nascimento?: string;
    curso?: string;
    cnpj?: string;
};

export async function loader({ request }: { request: Request }): Promise<Usuario> {
    const cookie = request.headers.get("Cookie") ?? "";
    const resposta = await api("/perfil", { headers: { Cookie: cookie } });
    if (resposta.status === 401) {
        throw redirect("/login");
    }
    const dados = await resposta.json();
    return dados.usuario as Usuario;
}

export default function Perfil() {
    const usuario = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const ehAluno = usuario.tipo === "aluno";

    const [nome, setNome] = useState(usuario.nome);
    const [email, setEmail] = useState(usuario.email);
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState(usuario.telefone);
    const [nascimento, setNascimento] = useState(usuario.nascimento ?? "");
    const [curso, setCurso] = useState(usuario.curso ?? "");
    const [cnpj, setCnpj] = useState(usuario.cnpj ?? "");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erros, setErros] = useState<Record<string, string>>({});
    const [erroGeral, setErroGeral] = useState("");
    const [salvo, setSalvo] = useState(false);

    function voltar() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(ehAluno ? "/aluno" : "/empresa");
        }
    }

    async function handleSubmit() {
        setErros({});
        setErroGeral("");
        setSalvo(false);

        const dados = ehAluno
            ? { nome, email, senha, telefone, nascimento, curso }
            : { nome, email, senha, telefone, cnpj };

        try {
            const resposta = await fetch("http://localhost:3000/perfil", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(dados),
            });

            const retorno = await resposta.json();

            if (!resposta.ok) {
                if (retorno.erros) {
                    setErros(retorno.erros);
                } else {
                    setErroGeral(retorno.mensagem ?? "Não foi possível salvar as alterações.");
                }
                return;
            }

            setSalvo(true);
            setSenha("");
            console.log("Perfil atualizado:", retorno);
        } catch {
            setErroGeral("Erro de conexão com o servidor.");
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={voltar}
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
            >
                <MdArrowBack size={18} />
                Voltar
            </button>

            <Card className="mt-4 bg-background">
                <h2 className="font-bold text-text-secondary">Editar Perfil</h2>
                <p className="mt-1 mb-6 text-sm text-text-muted">
                    Atualize seus dados abaixo. Deixe a senha em branco para mantê-la.
                </p>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <Campo
                        label={ehAluno ? "Nome Completo" : "Razão Social"}
                        placeholder={ehAluno ? "Digite seu nome completo" : "Nome da empresa"}
                        value={nome}
                        onChange={setNome}
                        erro={erros.nome}
                    />
                    <Campo
                        label="Email Institucional"
                        type="email"
                        placeholder={ehAluno ? "seu.nome@aluno.feliz.ifrs.edu.br" : "contato@empresa.com.br"}
                        value={email}
                        onChange={setEmail}
                        erro={erros.email}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Nova Senha</label>
                            <div className="relative">
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Deixe em branco para manter"
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
                        {ehAluno ? (
                            <Campo
                                label="Data de Nascimento"
                                type="date"
                                value={nascimento}
                                onChange={setNascimento}
                                erro={erros.nascimento}
                            />
                        ) : (
                            <Campo
                                label="CNPJ"
                                placeholder="00.000.000/0000-00"
                                value={cnpj}
                                onChange={setCnpj}
                                erro={erros.cnpj}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Campo
                            label="Telefone"
                            placeholder="(54) 99999-9999"
                            value={telefone}
                            onChange={setTelefone}
                            erro={erros.telefone}
                        />
                        {ehAluno && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-text-primary">Curso</label>
                                <SelectCurso curso={curso} onChange={ n => setCurso(n)}/>
                                {erros.curso && <p className="text-xs text-red-600">{erros.curso}</p>}
                            </div>
                        )}
                    </div>

                    {salvo && (
                        <p className="rounded-md bg-background-success px-4 py-2 text-sm text-primary">
                            Dados atualizados com sucesso!
                        </p>
                    )}

                    {erroGeral && (
                        <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
                            {erroGeral}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="mt-2 rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                    >
                        Salvar Alterações
                    </button>
                </form>
            </Card>
        </div>
    );
}