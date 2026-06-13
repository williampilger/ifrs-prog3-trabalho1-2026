import Link from "next/link";

export default function Home() {
  return (
    <section className="grid items-center gap-10 py-12 md:grid-cols-2">
      <div>
        <span className="inline-block rounded-full bg-[#EFF6E9] px-4 py-1 text-sm font-medium text-[#006B1F]">
          IFRS Campus Feliz
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-tight text-[#171D16] md:text-5xl">
          Encontre seu estágio obrigatório no IFRS Campus Feliz
        </h1>
        <p className="mt-5 max-w-md text-[#3F4A3C]">
          Conectamos estudantes talentosos a empresas parceiras, facilitando a
          formalização e acompanhamento de estágios obrigatórios e não-obrigatórios.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/login?perfil=aluno" className="rounded-lg bg-[#006B1F] px-6 py-3 text-sm font-medium text-white hover:bg-[#005419] transition-colors">
            Sou Aluno
          </Link>
          <Link href="/login?perfil=empresa" className="rounded-lg border border-[#006B1F] px-6 py-3 text-sm font-medium text-[#006B1F] hover:bg-[#EFF6E9] transition-colors">
            Sou Empresa
          </Link>
        </div>
      </div>
      <div className="flex h-72 items-center justify-center rounded-xl bg-[#006B1F]/90 text-white/70">
        [ ilustração ]
      </div>
    </section>
  );
}