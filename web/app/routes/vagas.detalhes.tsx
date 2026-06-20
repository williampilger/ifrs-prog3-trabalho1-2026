import { useState } from "react";
import { Link } from "react-router";
import {
    MdSchool,
    MdLocationOn,
    MdAttachMoney,
    MdAccessTime,
    MdCheckCircle,
    MdArrowBack,
    MdBusiness,
    MdCheck,
    MdContentCopy,
} from "react-icons/md";
import Card from "../components/Card";

// Mock da Vaga
const vaga = {
    titulo: "Estágio em Desenvolvimento Web",
    empresa: "Tech Solutions",
    curso: "Ciência da Computação",
    local: "Porto Alegre, RS",
    modalidade: "Presencial",
    cargaHoraria: "30 horas (6h/dia)",
    remuneracao: "R$ 1.500,00",
    descricaoAtividades:
        "Desenvolvimento e manutenção de interfaces web utilizando React e TypeScript, integração com APIs REST e participação nas revisões de código da equipe.",
    descricaoHabilidades:
        "Conhecimento em HTML, CSS e JavaScript. Noções de Git e familiaridade com algum framework front-end são diferenciais.",
    beneficios: ["Vale Transporte", "Vale Refeição/Alimentação", "Auxílio Remoto"],
    contatoNome: "Maria Souza",
    contatoEmail: "rh@techsolutions.com.br",
    contatoTelefone: "(54) 99999-9999",
};

// Mock do Aluno
const aluno = {
    nome: "João Silva",
    curso: "Análise e Desenvolvimento de Sistemas",
};

export default function VagasDetalhes() {
    const [mostrarContato, setMostrarContato] = useState(false);
    const [copiado, setCopiado] = useState(false);

    const mensagem = `Olá, tudo bem?

Me chamo ${aluno.nome} e estou cursando ${aluno.curso}

Estou interessado na vaga de estágio ${vaga.titulo} da sua ${vaga.empresa}.

Atenciosamente,
${aluno.nome}`;

    async function copiarMensagem() {
        await navigator.clipboard.writeText(mensagem);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
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
                            {vaga.empresa}
                        </h3>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdSchool className="text-primary" />
                                {vaga.curso}
                            </span>
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdLocationOn className="text-primary" />
                                {vaga.local} ({vaga.modalidade})
                            </span>
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdAttachMoney className="text-primary" />
                                {vaga.remuneracao}
                            </span>
                            <span className="flex items-center gap-2 text-text-primary">
                                <MdAccessTime className="text-primary" />
                                {vaga.cargaHoraria}
                            </span>
                        </div>
                    </Card>

                    <Card className="bg-background border border-border">
                        <h3 className="text-xl font-semibold text-text-secondary">
                            Descrição de Atividades
                        </h3>
                        <p className="mt-3 text-text-primary">
                            {vaga.descricaoAtividades}
                        </p>
                    </Card>
                    <Card className="bg-background border border-border">
                        <h3 className="text-xl font-semibold text-text-secondary">
                            Requisitos e Habilidades
                        </h3>
                        <p className="mt-3 text-text-primary">
                            {vaga.descricaoHabilidades}
                        </p>
                    </Card>

                    <Card className="bg-background border border-border">
                        <h3 className="text-xl font-semibold text-text-secondary">
                            Benefícios
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2">
                            {vaga.beneficios.map((b) => (
                                <li
                                    key={b}
                                    className="flex items-center gap-2 text-text-primary"
                                >
                                    <MdCheckCircle className="text-primary" />
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
                <div className="md:col-span-2 flex flex-col gap-6">
                    <Card className="bg-background border border-border">
                        <h3 className="text-xl font-semibold text-text-secondary">
                            Interessado na vaga?
                        </h3>
                        {!mostrarContato ?(
                            <button 
                                onClick={() => setMostrarContato(true)}
                                className="mt-4 bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                Ver contato
                            </button>
                        ) : (
                            <div className="mt-4">
                                <p className="text-text-primary">
                                    {vaga.contatoNome}
                                </p>
                                <p className="text-text-primary">
                                    {vaga.contatoEmail}
                                </p>
                                <p className="text-text-primary">
                                    {vaga.contatoTelefone}
                                </p>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                        Modelo de mensagem
                                    </span>
                                    <pre className="whitespace-pre-wrap rounded-md border border-border bg-background-alt p-3 text-xs text-text-primary font-sans">
                                        {mensagem}
                                    </pre>
                                    <button
                                        onClick={copiarMensagem}
                                        className="flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-medium text-text-primary hover:bg-background-alt transition-colors"
                                    >
                                        {copiado ? (
                                            <>
                                                <MdCheck className="text-primary" />
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
                            </div>
                        )}
                    </Card>
                </div>
            </section>
            
        </div>
    );
}