"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdLogout, MdPerson, MdKeyboardArrowDown } from "react-icons/md";

type HeaderLogadoProps = {
  nome: string;
  iniciais: string;
};

export default function HeaderLogado({ nome, iniciais }: HeaderLogadoProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="bg-background border-b border-border flex items-center justify-between px-8 py-5">
      <Link href="/" className="text-lg font-bold text-primary flex items-center gap-2">
        <Image src="/images/ifrs-logo-verde.png" alt="Logo Ifrs" width={40} height={40} style={{ height: "auto" }}/>
        Sistema de Estágios
      </Link>

      <div className="relative">
        <button onClick={() => setAberto((v) => !v)} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {iniciais}
          </span>
          <span className="text-sm font-medium text-text-primary">{nome}</span>
          <MdKeyboardArrowDown className="text-text-muted" />
        </button>

        {aberto && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-white py-1 shadow-md">
            <Link
              href="/perfil"
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background-alt"
            >
              <MdPerson size={18} />
              Editar Perfil
            </Link>
            <button
              onClick={() => {
                console.log("logout");
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-background-alt"
            >
              <MdLogout size={18} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}