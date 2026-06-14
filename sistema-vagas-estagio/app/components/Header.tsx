import Link from "next/link";
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-color-background border-b border-color-border flex items-center justify-between px-8 py-5">
      <Link href="/" className="text-lg font-bold text-primary flex items-center gap-2">
        <Image src="/images/ifrs-logo-verde.png" alt="Logo Ifrs" width={40} height={40} />
        Sistema de Estágios
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-primary font-medium">
          Login
        </Link>
        <Link
          href="/cadastro"
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Cadastrar
        </Link>
      </div>
    </header>
  );
}