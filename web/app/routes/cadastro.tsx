import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import SelectCurso from "~/components/SelectCurso";
import API from "../api/api";
import Campo from "../components/Campo";
import Card from "../components/Card";
import { useAuth } from "../lib/auth";

const schemaCadastro = z
    .object({
        nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
        email: z.string().email("E-mail inválido."),
        senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
        tipo: z.enum(["aluno", "empresa"]),
        nascimento: z.string().optional(),
        cnpj: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.tipo === "aluno" && !data.nascimento) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nascimento"], message: "Data de nascimento é obrigatória." });
        }
        if (data.tipo === "empresa" && !data.cnpj) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cnpj"], message: "CNPJ é obrigatório." });
        }
    });

export default function Cadastro() {
    const navigate = useNavigate();
    const { recarregar } = useAuth();
    const [aba, setAba] = useState<"aluno" | "empresa">("aluno");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [curso, setCurso] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [aceito, setAceito] = useState(false);
    const [erros, setErros] = useState<Record<string, string>>({});
    const [erroGeral, setErroGeral] = useState("");

    function trocarAba(nova: "aluno" | "empresa") {
        setAba(nova);
        setErros({});
        setErroGeral("");
    }

    async function handleSubmit() {
        setErros({});
        setErroGeral("");

        const dados =
            aba === "aluno"
                ? { nome, email, senha, telefone, nascimento, curso, tipo: "aluno" as const }
                : { nome, email, senha, telefone, cnpj, tipo: "empresa" as const };

        // 1. Validação local dos campos + termos: tudo de uma vez.
        const errosLocais: Record<string, string> = {};

        const parsed = schemaCadastro.safeParse(dados);
        if (!parsed.success) {
            for (const issue of parsed.error.issues) {
                const campo = issue.path.join(".");
                if (campo && !errosLocais[campo]) errosLocais[campo] = issue.message;
            }
        }
        if (!aceito) {
            errosLocais.aceito = "Você deve aceitar os termos e condições";
        }

        // Se há qualquer erro local, mostra todos juntos e não chama a API.
        if (Object.keys(errosLocais).length > 0) {
            setErros(errosLocais);
            return;
        }

        // 2. Tudo válido no cliente: envia ao backend.
        try {
            const rCadastro = await API.cadastro.criar(dados);

            if (!rCadastro.success) {
                if (rCadastro.data?.erros) {
                    setErros(rCadastro.data.erros);
                } else {
                    setErroGeral(rCadastro.data?.mensagem ?? "Não foi possível criar a conta.");
                }
                return;
            }

            const rLogin = await API.auth.login(email, senha);

            if (!rLogin.success) {
                navigate("/login");
                return;
            }

            await recarregar();

            const rAuth = await API.auth.check();
            const tipo = rAuth.data?.usuario?.tipo;

            navigate(tipo === "empresa" ? "/empresa" : "/aluno");
        } catch {
            setErroGeral("Erro de conexão com o servidor.");
        }
    }

    return (
        <Card className="max-w-2xl mx-auto bg-background">
            <div className="mb-6 flex border-b border-border">
                <button
                    onClick={() => trocarAba("aluno")}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                        aba === "aluno" ? "border-b-2 border-primary text-primary" : "text-text-muted"
                    }`}
                >
                    Sou Aluno
                </button>
                <button
                    onClick={() => trocarAba("empresa")}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                        aba === "empresa" ? "border-b-2 border-primary text-primary" : "text-text-muted"
                    }`}
                >
                    Sou Empresa
                </button>
            </div>

            <h2 className="font-bold text-text-secondary">
                {aba === "aluno" ? "Cadastro de Estudante" : "Cadastro de Empresa"}
            </h2>
            <p className="mt-1 mb-6 text-sm text-text-muted">
                {aba === "aluno"
                    ? "Preencha os dados abaixo com suas informações institucionais."
                    : "Preencha os dados da empresa para publicar vagas."}
            </p>

            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <Campo
                    label={aba === "aluno" ? "Nome Completo" : "Razão Social"}
                    placeholder={aba === "aluno" ? "Digite seu nome completo" : "Nome da empresa"}
                    value={nome}
                    onChange={setNome}
                    erro={erros.nome}
                />
                <Campo
                    label="Email Institucional"
                    type="email"
                    placeholder={aba === "aluno" ? "seu.nome@aluno.feliz.ifrs.edu.br" : "contato@empresa.com.br"}
                    value={email}
                    onChange={setEmail}
                    erro={erros.email}
                />

                <div className="grid grid-cols-2 gap-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-primary">Senha</label>
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

                    {aba === "aluno" ? (
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
                    {aba === "aluno" && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Curso</label>
                            <SelectCurso curso={curso} onChange={ n => setCurso(n)}/>
                            {erros.curso && <p className="text-xs text-red-600">{erros.curso}</p>}
                        </div>
                    )}
                </div>

                <label className="flex items-center gap-2 text-sm text-text-muted">
                    <input
                        type="checkbox"
                        className="accent-primary"
                        checked={aceito}
                        onChange={(e) => setAceito(e.target.checked)}
                    />
                    Eu aceito os{" "}
                    <Link to="/termos" className="text-primary">Termos de Uso</Link>
                    {" "}e{" "}
                    <Link to="/privacidade" className="text-primary">Política de Privacidade</Link>.
                </label>
                {erros.aceito && <p className="text-xs text-red-600">{erros.aceito}</p>}

                {erroGeral && (
                    <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
                        {erroGeral}
                    </p>
                )}

                <button
                    type="submit"
                    className="mt-2 rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                >
                    Criar minha conta
                </button>
            </form>

            <p className="mt-5 text-center text-sm text-text-muted">
                Já possui uma conta?{" "}
                <Link to="/login" className="font-medium text-primary">Faça Login</Link>
            </p>

        </Card>
    );
}