import Link from "next/link";
import { MdSchool, MdBusiness, MdAccountBalance, MdVerified, MdSpeed } from "react-icons/md";

const features = [
  {
    titulo: "Processo Ágil",
    texto: "Formalize seu termo de compromisso de forma digital e rápida, sem burocracias desnecessárias.",
    icone: <MdSpeed className="fill-white block"/>,
  },
  {
    titulo: "Vagas Validadas",
    texto: "Todas as oportunidades são revisadas pela coordenação para garantir alinhamento pedagógico.",
    icone: <MdVerified className="fill-white block"/>,
  },
  {
    titulo: "Institucional",
    texto: "Canal oficial do IFRS para integração entre o mundo acadêmico e o mercado de trabalho.",
    icone: <MdAccountBalance className="fill-white block"/>,
  },
];

export default function Home() {
  return (
    <>
      <section className="grid items-center gap-10 py-12 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
            IFRS Campus Feliz
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-text-secondary md:text-5xl">
            Encontre seu estágio obrigatório no IFRS Campus Feliz
          </h1>
          <p className="mt-5 max-w-md text-text-primary">
            Conectamos estudantes talentosos a empresas parceiras, facilitando a
            formalização e acompanhamento de estágios obrigatórios e não-obrigatórios.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login?perfil=aluno" className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors flex items-center gap-2">
              <MdSchool className="fill-white block" size={20}/>
              Sou Aluno
            </Link>
            <Link href="/login?perfil=empresa" className="rounded-lg border border-primary px-6 py-3 text-sm font-medium text-primary hover:bg-primary-light transition-colors flex items-center gap-2">
              <MdBusiness className="fill-primary block" size={20}/>
              Sou Empresa
            </Link>
          </div>
        </div>
        <div className="flex h-72 items-center justify-center rounded-xl bg-primary/90 text-white/70">
          [ ilustração ]
        </div>
      </section>
      
      <section className="grid gap-6 py-12 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.titulo}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-lg text-white">
              {f.icone}
            </div>
            <h3 className="mt-4 text-lg font-bold text-text-secondary">{f.titulo}</h3>
            <p className="mt-2 text-sm text-text-muted">{f.texto}</p>
          </div>
        ))}
      </section>
    </>
  );
}