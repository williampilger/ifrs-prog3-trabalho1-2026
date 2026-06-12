import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5">
      {/* Logo / nome do sistema */}
      <Link href="/" className="text-lg font-bold text-[#006B1F]">
        Sistema de Estágios
      </Link>

      {/* Ações à direita */}
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-[#006B1F] font-medium">
          Login
        </Link>
        <Link
          href="/cadastro"
          className="rounded-lg bg-[#006B1F] px-5 py-2 text-sm font-medium text-white hover:bg-[#005419]"
        >
          Cadastrar
        </Link>
      </div>
    </header>
  );
}