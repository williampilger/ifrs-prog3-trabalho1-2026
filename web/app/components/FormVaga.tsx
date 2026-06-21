import { useEffect, useState } from "react";
import { MdAdd, MdArrowBack, MdClose, MdSend } from "react-icons/md";
import { Link } from "react-router";
import { api } from "../lib/api";
import Campo from "./Campo";
import Card from "./Card";
import SelectCurso from "./SelectCurso";

export type DadosVaga = {
    vaga: string;
    curso: string;
    localidade: string;
    modalidade: string;
    cargaHoraria: string;
    salario: string;
    beneficios: string[];
    descricaoAtividades: string;
    descricaoHabilidades: string;
};

const opcoesModalidade = [
    { valor: "presencial", label: "Presencial" },
    { valor: "hibrido", label: "Híbrido" },
    { valor: "remoto", label: "Remoto" },
];

const opcoesCargaHoraria = [
    { valor: "20h", label: "20 horas (4h/dia)" },
    { valor: "30h", label: "30 horas (6h/dia)" },
    { valor: "40h", label: "40 horas (8h/dia)" },
];

const valoresVazios: DadosVaga = {
    vaga: "",
    curso: "",
    localidade: "",
    modalidade: "",
    cargaHoraria: "",
    salario: "",
    beneficios: [],
    descricaoAtividades: "",
    descricaoHabilidades: "",
};

type FormVagaProps = {
    titulo: string;
    descricao: string;
    textoBotao: string;
    valoresIniciais?: DadosVaga;
    erros?: Record<string, string>;
    onSubmit: (dados: DadosVaga) => void;
};

type BeneficioSugestao = { id: number; nome: string };

export default function FormVaga({
    titulo,
    descricao,
    textoBotao,
    valoresIniciais = valoresVazios,
    erros = {},
    onSubmit,
}: FormVagaProps) {
    const [vaga, setVaga] = useState(valoresIniciais.vaga);
    const [curso, setCurso] = useState(valoresIniciais.curso);
    const [localidade, setLocalidade] = useState(valoresIniciais.localidade);
    const [modalidade, setModalidade] = useState(valoresIniciais.modalidade);
    const [cargaHoraria, setCargaHoraria] = useState(valoresIniciais.cargaHoraria);
    const [salario, setSalario] = useState(valoresIniciais.salario);
    const [descricaoAtividades, setDescricaoAtividades] = useState(valoresIniciais.descricaoAtividades);
    const [descricaoHabilidades, setDescricaoHabilidades] = useState(valoresIniciais.descricaoHabilidades);

    const [sugestoes, setSugestoes] = useState<BeneficioSugestao[]>([]);
    const [selecionados, setSelecionados] = useState<string[]>(valoresIniciais.beneficios);
    const [customBeneficios, setCustomBeneficios] = useState<string[]>([]);
    const [customInput, setCustomInput] = useState("");

    useEffect(() => {
        api("/beneficios")
            .then((r) => r.json())
            .then((data: BeneficioSugestao[]) => {
                setSugestoes(data);
                const nomesSugestoes = data.map((b) => b.nome);
                const extras = valoresIniciais.beneficios.filter((b) => !nomesSugestoes.includes(b));
                if (extras.length > 0) setCustomBeneficios(extras);
            })
            .catch(() => {
                setCustomBeneficios(valoresIniciais.beneficios);
                setSelecionados([]);
            });
    }, []);

    function toggle(nome: string) {
        setSelecionados((atual) =>
            atual.includes(nome) ? atual.filter((v) => v !== nome) : [...atual, nome]
        );
    }

    function adicionarCustom() {
        const nome = customInput.trim();
        if (!nome) return;
        const jaExiste =
            sugestoes.some((s) => s.nome.toLowerCase() === nome.toLowerCase()) ||
            customBeneficios.some((b) => b.toLowerCase() === nome.toLowerCase());
        if (!jaExiste) {
            setCustomBeneficios((prev) => [...prev, nome]);
        }
        if (!selecionados.some((s) => s.toLowerCase() === nome.toLowerCase())) {
            setSelecionados((prev) => [...prev, nome]);
        }
        setCustomInput("");
    }

    function removerCustom(nome: string) {
        setCustomBeneficios((prev) => prev.filter((b) => b !== nome));
        setSelecionados((prev) => prev.filter((v) => v !== nome));
    }

    function handleSubmit() {
        onSubmit({
            vaga,
            curso,
            localidade,
            modalidade,
            cargaHoraria,
            salario,
            beneficios: selecionados,
            descricaoAtividades,
            descricaoHabilidades,
        });
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                to="/empresa"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
            >
                <MdArrowBack size={18} />
                Voltar
            </Link>

            <Card className="max-w-4xl mx-auto mt-4 bg-background">
                <h2 className="font-bold text-text-secondary">{titulo}</h2>
                <p className="mt-2 mb-6 text-sm text-text-muted">{descricao}</p>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <Campo
                        label="Título da Vaga"
                        placeholder="Ex: Desenvolvedor Frontend"
                        value={vaga}
                        onChange={setVaga}
                        erro={erros.vaga}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Curso</label>
                            <SelectCurso curso={curso} onChange={(n) => setCurso(n)} />
                            {erros.curso && <p className="text-xs text-red-600">{erros.curso}</p>}
                        </div>
                        <Campo
                            label="Localidade"
                            placeholder="Ex: Cidade, RS"
                            value={localidade}
                            onChange={setLocalidade}
                            erro={erros.localidade}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-primary">Modalidade</label>
                        <div className="flex items-center gap-6">
                            {opcoesModalidade.map((o) => (
                                <label key={o.valor} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                                    <input
                                        type="radio"
                                        name="modalidade"
                                        value={o.valor}
                                        checked={modalidade === o.valor}
                                        onChange={(e) => setModalidade(e.target.value)}
                                        className="accent-primary"
                                    />
                                    {o.label}
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
                                {opcoesCargaHoraria.map((o) => (
                                    <option key={o.valor} value={o.valor}>{o.label}</option>
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

                        {sugestoes.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {sugestoes.map((b) => (
                                    <label key={b.id} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selecionados.includes(b.nome)}
                                            onChange={() => toggle(b.nome)}
                                            className="accent-primary"
                                        />
                                        {b.nome}
                                    </label>
                                ))}
                            </div>
                        )}

                        {customBeneficios.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {customBeneficios.map((nome) => (
                                    <span
                                        key={nome}
                                        className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm text-text-primary"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selecionados.includes(nome)}
                                            onChange={() => toggle(nome)}
                                            className="accent-primary"
                                        />
                                        {nome}
                                        <button
                                            type="button"
                                            onClick={() => removerCustom(nome)}
                                            className="ml-1 text-text-muted hover:text-red-500 transition-colors"
                                            aria-label={`Remover ${nome}`}
                                        >
                                            <MdClose size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionarCustom(); } }}
                                placeholder="Adicionar benefício personalizado..."
                                className="flex-1 rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={adicionarCustom}
                                className="flex items-center gap-1 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                                <MdAdd size={16} /> Adicionar
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-primary">Descrição das Atividades</label>
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
                        <label className="text-sm font-medium text-text-primary">Requisitos e Habilidades</label>
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
                        <MdSend size={18} /> {textoBotao}
                    </button>
                </form>
            </Card>
        </div>
    );
}
