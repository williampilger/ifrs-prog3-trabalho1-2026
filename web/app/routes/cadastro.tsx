import { useState } from "react";
import { Link } from "react-router";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Card from "../components/Card";
import Campo from "../components/Campo";

export default function Cadastro() {
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

        // Aceite dos termos é regra de interface, verificada no front
        if (!aceito) {
            setErros({ aceito: "Você deve aceitar os termos e condições" });
            return;
        }

        const dados =
            aba === "aluno"
                ? { nome, email, senha, telefone, nascimento, curso, tipo: "aluno" }
                : { nome, email, senha, telefone, cnpj, tipo: "empresa" };

        try {
            const resposta = await fetch("http://localhost:3000/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(dados),
            });

            const retorno = await resposta.json();

            if (!resposta.ok) {
                if (retorno.erros) {
                    setErros(retorno.erros);
                } else {
                    setErroGeral(retorno.mensagem ?? "Não foi possível criar a conta.");
                }
                return;
            }

            console.log("Cadastro OK:", retorno);
            // depois: redirecionar para /login ou já logar
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
                            <select
                                value={curso}
                                onChange={(e) => setCurso(e.target.value)}
                                className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Selecione seu curso</option>
                                <option value="info">Informática</option>
                                <option value="quimica">Química</option>
                                <option value="admin">Administração</option>
                            </select>
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