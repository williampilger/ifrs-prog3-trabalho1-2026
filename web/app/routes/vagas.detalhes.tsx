import { useEffect, useState } from "react";
import {
    MdAccessTime,
    MdArrowBack,
    MdAttachMoney,
    MdBusiness,
    MdCheck,
    MdCheckCircle,
    MdContentCopy,
    MdLocationOn,
    MdSchool,
} from "react-icons/md";
import { Link, useParams } from "react-router";
import type { Vaga } from "~/api/types";
import API from "../api/api";
import Card from "../components/Card";
import { useAuth } from "../lib/auth";

const turnoLabels: Record<string, string> = {
    integral: "Integral (6h/dia)",
    manha: "Manhã (4h/dia)",
    tarde: "Tarde (4h/dia)",
    noite: "Noite (4h/dia)",
};

const modalidadeLabels: Record<string, string> = {
    presencial: "Presencial",
    remoto: "Remoto",
    hibrido: "Híbrido",
};

function formatarRemuneracao(salario: number | null): string {
    if (!salario) return "A combinar";
    return salario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function VagasDetalhes() {
    const { id } = useParams<{ id: string }>();
    const { usuario } = useAuth();
    const [vaga, setVaga] = useState<Vaga | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [mostrarContato, setMostrarContato] = useState(false);
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        API.vagas.get(id!)
            .then((r) => {
                if (r.success && r.data?.vaga) setVaga(r.data.vaga);
                else setErro("Vaga não encontrada.");
            })
            .catch(() => setErro("Erro ao carregar a vaga."))
            .finally(() => setCarregando(false));
    }, [id]);

    const saudacao = vaga?.contatoNome ? `Olá, ${vaga.contatoNome}!` : "Olá!";

    const mensagem = vaga && usuario ? `${saudacao}

Meu nome é ${usuario.nome}, sou estudante de ${usuario.curso ?? "curso técnico"} no IFRS Campus Feliz e estou em busca de uma oportunidade de estágio.

Encontrei a vaga "${vaga.titulo}" publicada pela ${vaga.empresa?.nome ?? "empresa"} e gostaria de demonstrar meu interesse. A oportunidade está alinhada com minha área de formação e acredito que contribuiria para o meu desenvolvimento profissional.

Poderia me informar sobre os próximos passos do processo seletivo?

Atenciosamente,
${usuario.nome}` : "";

    async function copiarMensagem() {
        await navigator.clipboard.writeText(mensagem);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    }

    if (carregando) {
        return <p className="text-sm text-text-muted p-8">Carregando...</p>;
    }

    if (erro || !vaga) {
        return <p className="text-sm text-red-600 p-8">{erro || "Vaga não encontrada."}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                to="/aluno"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
            >
                <MdArrowBack size={18} />
                Voltar para as vagas
            </Link>

            <section className="mt-4 grid gap-6 md:grid-cols-6">
                <div className="md:col-span-4 flex flex-col gap-6">
                    <Card className="bg-background border border-border">
                        <h1 className="mt-3 text-3xl font-bold text-text-secondary">
                            {vaga.titulo}
                        </h1>
                        <h3 className="mt-1 flex items-center gap-2 text-sm text-text-primary">
                            <MdBusiness className="text-primary" />
                            {vaga.empresa?.nome}
                        </h3>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdSchool className="text-primary" />
                                {vaga.area.nome}
                            </span>
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdLocationOn className="text-primary" />
                                {vaga.local ?? "A definir"} ({modalidadeLabels[vaga.modalidade] ?? vaga.modalidade})
                            </span>
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdAttachMoney className="text-primary" />
                                {formatarRemuneracao(vaga.salario)}
                            </span>
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdAccessTime className="text-primary" />
                                {turnoLabels[vaga.turno] ?? vaga.turno}
                            </span>
                        </div>
                    </Card>

                    <Card className="bg-background border border-border">
                        <h3 className="text-xl font-semibold text-text-secondary">
                            Descrição da Vaga
                        </h3>
                        <p className="mt-3 text-text-primary whitespace-pre-wrap">
                            {vaga.descricao}
                        </p>
                    </Card>

                    {(vaga.beneficios?.length ?? 0) > 0 && (
                        <Card className="bg-background border border-border">
                            <h3 className="text-xl font-semibold text-text-secondary">
                                Benefícios
                            </h3>
                            <ul className="mt-3 flex flex-col gap-2">
                                {vaga.beneficios!.map((vb) => (
                                    <li
                                        key={vb.id}
                                        className="flex items-center gap-2 text-text-primary"
                                    >
                                        <MdCheckCircle className="text-primary" />
                                        {vb.nome}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}
                </div>

                <div className="md:col-span-2 flex flex-col gap-6">
                    <Card className="bg-background border border-border">
                        <h3 className="text-xl font-semibold text-text-secondary">
                            Interessado na vaga?
                        </h3>
                        {!mostrarContato ? (
                            <button
                                onClick={() => setMostrarContato(true)}
                                className="mt-4 bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                Ver contato
                            </button>
                        ) : (
                            <div className="mt-4 flex flex-col gap-2">
                                {vaga.contatoNome && <p className="text-text-primary">{vaga.contatoNome}</p>}
                                {vaga.contatoEmail && <p className="text-text-primary">{vaga.contatoEmail}</p>}
                                {vaga.contatoTelefone && <p className="text-text-primary">{vaga.contatoTelefone}</p>}
                                <span className="mt-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                                    Modelo de mensagem
                                </span>
                                <pre className="whitespace-pre-wrap rounded-md border border-border bg-background-alt p-3 text-xs text-text-primary font-sans">
                                    {mensagem}
                                </pre>
                                <button
                                    onClick={copiarMensagem}
                                    className="flex items-center justify-center bg-primary text-white gap-2 rounded-lg border border-border py-2 text-sm font-medium"
                                >
                                    {copiado ? (
                                        <>
                                            <MdCheck />
                                            Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <MdContentCopy />
                                            Copiar mensagem
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </Card>
                </div>
            </section>
        </div>
    );
}
