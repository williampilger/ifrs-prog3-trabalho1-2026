"use client";

import { useState } from "react";
import Link from "next/link";

export default function Cadastro() {
  // Aba ativa: "aluno" ou "empresa"
  const [aba, setAba] = useState<"aluno" | "empresa">("aluno");

  // Campos comuns às duas abas
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");

  // Campos só de aluno
  const [nascimento, setNascimento] = useState("");
  const [curso, setCurso] = useState("");

  // Campo só de empresa
  const [cnpj, setCnpj] = useState("");

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
      {/* Abas */}
      <div className="mb-6 flex border-b border-border">
        <button
          onClick={() => setAba("aluno")}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            aba === "aluno"
              ? "border-b-2 border-primary text-primary"
              : "text-text-muted"
          }`}
        >
          Sou Aluno
        </button>
        <button
          onClick={() => setAba("empresa")}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            aba === "empresa"
              ? "border-b-2 border-primary text-primary"
              : "text-text-muted"
          }`}
        >
          Sou Empresa
        </button>
      </div>

      {/* Título dinâmico */}
      <p className="text-lg font-bold text-text-secondary">
        {aba === "aluno" ? "Cadastro de Estudante" : "Cadastro de Empresa"}
      </p>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        {aba === "aluno"
          ? "Preencha os dados abaixo com suas informações institucionais."
          : "Preencha os dados da empresa para publicar vagas."}
      </p>

      {/* Formulário */}
      <form className="flex flex-col gap-4">
        <Campo
          label={aba === "aluno" ? "Nome Completo" : "Razão Social"}
          placeholder={aba === "aluno" ? "Digite seu nome completo" : "Nome da empresa"}
          value={nome}
          onChange={setNome}
        />

        <Campo
          label="Email Institucional"
          type="email"
          placeholder={aba === "aluno" ? "seu.nome@aluno.feliz.ifrs.edu.br" : "contato@empresa.com.br"}
          value={email}
          onChange={setEmail}
        />

        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={setSenha}
          />

          {/* Campo que MUDA conforme a aba */}
          {aba === "aluno" ? (
            <Campo
              label="Data de Nascimento"
              type="date"
              value={nascimento}
              onChange={setNascimento}
            />
          ) : (
            <Campo
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={setCnpj}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Telefone"
            placeholder="(54) 99999-9999"
            value={telefone}
            onChange={setTelefone}
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
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" className="accent-primary" />
          Eu aceito os{" "}
          <Link href="/termos" className="text-primary">Termos de Uso</Link> e{" "}
          <Link href="/privacidade" className="text-primary">Política de Privacidade</Link>.
        </label>

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
    </div>
  );
}

// Componente pequeno pra um campo de input (evita repetir a estrutura)
function Campo({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}