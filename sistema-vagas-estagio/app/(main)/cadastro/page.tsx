"use client";

import { useState } from "react";
import Link from "next/link";
import {z} from "zod"
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Card from "@/app/components/Card";
import Campo from "@/app/components/Campo"

// Validação
const schemaAluno = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").nonempty("O nome é obrigatório"),
  email: z.email("Email inválido").nonempty("O email é obrigatório"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").nonempty("A senha é obrigatória"),
  telefone: z.string().min(10, "O telefone deve ter o DDD e o número").nonempty("O telefone é obrigatório"),
  nascimento: z.string().min(1, "Informe sua data de nascimento").nonempty("A data de nascimento é obrigatória"),
  curso: z.string().min(1, "Selecione seu curso").nonempty("O curso é obrigatório"),
  aceito: z.literal(true, {message: "Você deve aceitar os termos e condições"}),
})

const schemaEmpresa = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").nonempty("O nome é obrigatório"),
  email: z.email("Email inválido").nonempty("O email é obrigatório"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").nonempty("A senha é obrigatória"),
  telefone: z.string().min(10, "O telefone deve ter o DDD e o número").nonempty("O telefone é obrigatório"),
  cnpj: z.string().min(14, "O CNPJ deve ter 14 dígitos").nonempty("O CNPJ é obrigatório"),
  aceito: z.literal(true, {message: "Você deve aceitar os termos e condições"}),
})

export default function Cadastro() {
  // Abas
  const [aba, setAba] = useState<"aluno" | "empresa">("aluno");

  // Campos 
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");

  // Campos só de aluno
  const [nascimento, setNascimento] = useState("");
  const [curso, setCurso] = useState("");

  // Campo só de empresa
  const [cnpj, setCnpj] = useState("");
  
  // Mostrar/esconder senha
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Aceito os termos
  const [aceito, setAceito] = useState(false);

  const [erros, setErros] = useState<Record<string, string>>({});

  function handleSubmit(e: React.SubmitEvent){
    e.preventDefault();
    
    const schema = aba === "aluno" ? schemaAluno : schemaEmpresa;
    const dados =
      aba === "aluno"
        ? { nome, email, senha, telefone, nascimento, curso, aceito}
        : { nome, email, senha, telefone, cnpj, aceito };
    const resultado = schema.safeParse(dados);
    console.log(resultado);

    if(!resultado.success){
      const novosErros: Record<string, string> = {};
      for (const erro of resultado.error.issues){
        novosErros[erro.path[0] as string] = erro.message;
      }
      setErros(novosErros);
      return
    }

    setErros({});
    console.log("Dados válidos!", resultado.data);
  }
  
  return (
    <Card className="max-w-2xl mx-auto bg-background">
      {/* Abas */}
      <div className="mb-6 flex border-b border-border">
        <button
          onClick={() => {setAba("aluno"); setErros({});}}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            aba === "aluno"
              ? "border-b-2 border-primary text-primary"
              : "text-text-muted"
          }`}
        >
          Sou Aluno
        </button>
        <button
          onClick={() => {setAba("empresa"); setErros({});}}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            aba === "empresa"
              ? "border-b-2 border-primary text-primary"
              : "text-text-muted"
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

      {/* Formulário */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            <label className="text-sm font-medium text-text-primary"> Senha </label>
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
                {mostrarSenha ? <MdVisibilityOff />: <MdVisibility />}
              </button>
            </div>
            {erros.senha && <p className="text-xs text-red-600">{erros.senha}</p>}
          </div>
          {/* Campo que MUDA conforme a aba */}
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

          {/* Curso só aparece pra aluno */}
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
          <input type="checkbox" className="accent-primary" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
          Eu aceito os{" "}
          <Link href="/termos" className="text-primary">Termos de Uso</Link> e{" "}
          <Link href="/privacidade" className="text-primary">Política de Privacidade</Link>.
        </label>
        {erros.aceito && <p className="text-xs text-red-600">{erros.aceito}</p>}

        <button
          type="submit"
          className="mt-2 rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Criar minha conta
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Já possui uma conta?{" "}
        <Link href="/login" className="font-medium text-primary">Faça Login</Link>
      </p>
    </Card>
  );
}
