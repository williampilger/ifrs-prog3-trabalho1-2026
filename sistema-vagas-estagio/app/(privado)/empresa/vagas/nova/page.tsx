"use client";

import { useState } from "react";
import {z} from "zod"
import { MdSend } from "react-icons/md";
import Card from "@/app/components/Card";
import Campo from "@/app/components/Campo";

const schemaVaga = z.object({
  vaga: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
  curso: z.string().min(1, "Selecione um curso"),
  localidade: z.string().min(2, "Informe a localidade"),
  modalidade: z.string().min(1, "Selecione uma modalidade"),
  cargaHoraria: z.string().min(1, "Selecione a carga horária"),
  salario: z
    .string()
    .min(1, "Informe o valor da bolsa")
    .refine((v) => Number(v) > 0, "O valor deve ser maior que zero"),
  beneficios: z.array(z.string()),
  descricaoAtividades: z.string().min(10, "Descreva as atividades com mais detalhes"),
  descricaoHabilidades: z.string().min(10, "Descreva os requisitos com mais detalhes"),
});

export default function NovaVaga() {
    const [vaga, setVaga] = useState("");
    const [curso, setCurso] = useState("");
    const [localidade, setLocalidade] = useState("")
    const [modalidade, setModalidade] = useState("")
    const [cargaHoraria, setCargaHoraria] = useState("")
    const [salario, setSalario] = useState("")
    const [beneficios, setBeneficios] = useState<string[]>([]);
    const [descricaoAtividades, setDescricaoAtividades] = useState("")
    const [descricaoHabilidades, setDescricaoHabilidades] = useState("")

    const opcoesCurso = [
        { valor: "ads", label: "Análise e Desenvolvimento de Sistemas" },
        { valor: "cc", label: "Ciência da Computação" },
        { valor: "si", label: "Sistemas de Informação" },
    ];

    const opcoesModalidade = [
        { valor: "presencial", label: "Presencial" },
        { valor: "hibrido", label: "Híbrido" },
        { valor: "remoto", label: "Remoto" },
    ];

    const opcoesCargaHoraria = [
        { valor: "20h", label: "20 horas (4h/dia)" },
        { valor: "30h", label: "30 horas (6h/dia)" },
        { valor: "40h", label: "40 horas (8h/dia)" },
    ]
    const opcoesBeneficios = [
        { valor: "vt", label: "Vale Transporte" },
        { valor: "vr", label: "Vale Refeição/Alimentação" },
        { valor: "seguro", label: "Seguro de Vida" },
        { valor: "auxilio", label: "Auxílio Remoto" },
        { valor: "saude", label: "Plano de Saúde" },
    ];

    function toggle(valor: string) {
        setBeneficios((atual) =>
        atual.includes(valor)
            ? atual.filter((v) => v !== valor) // já tem: remove
            : [...atual, valor]                // não tem: adiciona
        );
    }

    const [erros, setErros] = useState<Record<string, string>>({});
    
    function handleSubmit(e: React.SubmitEvent){
        e.preventDefault();

        const dados = {
            vaga,
            curso,
            localidade,
            modalidade,
            cargaHoraria,
            salario,
            beneficios,
            descricaoAtividades,
            descricaoHabilidades,
        }

        const resultado = schemaVaga.safeParse(dados);
        if (!resultado.success) {
            const novosErros: Record<string, string> = {};
            for (const erro of resultado.error.issues){
                novosErros[erro.path[0] as string] = erro.message
            }
            setErros(novosErros);
            return;
        }

        setErros({})
        console.log("Vaga válida: ", resultado.data);
    }

    return (
        <Card className="max-w-2xl mx-auto bg-background">
            <h2 className="font-bold text-text-secondary">Cadastrar Vaga</h2>
            <p className="mt-2 mb-6 text-sm text-text-muted">
                Preencha os detalhes abaixo para publicar uma nova oportunidade de estágio para os alunos do IFRS.
            </p>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Campo 
                    label="Título da Vaga"
                    type="text" 
                    placeholder="Ex: Desenvolvedor Frontend" 
                    value={vaga} 
                    onChange={setVaga}
                    erro={erros.vaga}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-primary">Curso</label>
                        <select
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                        className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                        <option value="">Selecione seu curso</option>
                        {opcoesCurso.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                                {opcao.label}
                            </option>
                        ))}
                        </select>
                        {erros.curso && <p className="text-xs text-red-600">{erros.curso}</p>}
                    </div>
                    <Campo 
                        label="Localidade"
                        type="text" 
                        placeholder="Ex: Cidade, RS" 
                        value={localidade} 
                        onChange={setLocalidade}
                        erro={erros.localidade}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-primary">Modalidade</label>
                    <div className="flex items-center gap-6">
                        {opcoesModalidade.map((opcao) => (
                            <label
                            key={opcao.valor}
                            className="flex items-center gap-2 text-sm text-text-primary cursor-pointer"
                        >
                        <input
                            type="radio"
                            name="modalidade"
                            value={opcao.valor}
                            checked={modalidade === opcao.valor}
                            onChange={(e) => setModalidade(e.target.value)}
                            className="accent-primary"
                        />
                        {opcao.label}
                    </label>
                    ))}
                    {erros.modalidade && <p className="text-xs text-red-600">{erros.modalidade}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-primary">Carga Horária Semanal</label>
                        <select
                        value={cargaHoraria}
                        onChange={(e) => setCargaHoraria(e.target.value)}
                        className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                        <option value="">Selecione sua carga horária</option>
                        {opcoesCargaHoraria.map((opcao) => (
                            <option key={opcao.valor} value={opcao.valor}>
                                {opcao.label}
                            </option>
                        ))}
                        </select>
                        {erros.cargaHoraria && <p className="text-xs text-red-600">{erros.cargaHoraria}</p>}
                    </div>
                    <Campo 
                        label="Valor da Bolsa Auxílio"
                        type="number" 
                        placeholder="Ex: 1000,00" 
                        value={salario} 
                        onChange={setSalario} 
                        erro={erros.salario}
                    />                   
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-primary">Benefícios</label>
                    <div className="grid grid-cols-3 gap-3">
                        {opcoesBeneficios.map((opcao) => (
                        <label
                            key={opcao.valor}
                            className="flex items-center gap-2 text-sm text-text-primary cursor-pointer"
                        >
                            <input
                            type="checkbox"
                            value={opcao.valor}
                            checked={beneficios.includes(opcao.valor)}
                            onChange={() => toggle(opcao.valor)}
                            className="accent-primary"
                            />
                            {opcao.label}
                        </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-primary">
                        Descrição das Atividades
                    </label>
                    <textarea
                        value={descricaoAtividades}
                        onChange={(e) => setDescricaoAtividades(e.target.value)}
                        placeholder="Descreva as responsabilidades diárias do estagiário..."
                        rows={4}
                        className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    />
                    {erros.descricaoAtividades && <p className="text-xs text-red-600">{erros.descricaoAtividades}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-primary">
                        Requisitos e Habilidades
                    </label>
                    <textarea
                        value={descricaoHabilidades}
                        onChange={(e) => setDescricaoHabilidades(e.target.value)}
                        placeholder="Descreva os requisitos e habilidades necessárias..."
                        rows={4}
                        className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                    />
                    {erros.descricaoHabilidades && <p className="text-xs text-red-600">{erros.descricaoHabilidades}</p>}
                </div>
                <button
                    type="submit"
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                    >
                    <MdSend size={18} /> Publicar Vaga
                </button>
            </form>

        </Card> 
    );
}