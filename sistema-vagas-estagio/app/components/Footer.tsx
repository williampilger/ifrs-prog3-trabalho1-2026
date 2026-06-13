import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-color">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 md:px-8">
        {/* Logo institucional */}
        <span className="text-base font-bold text-text-secondary">IFRS Feliz</span>

        {/* Copyright */}
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Sistema de Estágios. Todos os direitos reservados.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link href="/termos" className="text-sm text-text-muted hover:text-primary">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="text-sm text-text-muted hover:text-primary">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}