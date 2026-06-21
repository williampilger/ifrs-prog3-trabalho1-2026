import { useState } from "react";
import { MdArrowBack, MdSend } from "react-icons/md";
import { Link } from "react-router";
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

const opcoesBeneficios = [
    { valor: "vt", label: "Vale Transporte" },
    { valor: "vr", label: "Vale Refeição/Alimentação" },
    { valor: "seguro", label: "Seguro de Vida" },
    { valor: "auxilio", label: "Auxílio Remoto" },
    { valor: "saude", label: "Plano de Saúde" },
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
    const [beneficios, setBeneficios] = useState<string[]>(valoresIniciais.beneficios);
    const [descricaoAtividades, setDescricaoAtividades] = useState(valoresIniciais.descricaoAtividades);
    const [descricaoHabilidades, setDescricaoHabilidades] = useState(valoresIniciais.descricaoHabilidades);

    function toggle(valor: string) {
        setBeneficios((atual) =>
            atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor]
        );
    }

    function handleSubmit() {
        onSubmit({
            vaga,
            curso,
            localidade,
            modalidade,
            cargaHoraria,
            salario,
            beneficios,
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
                            <SelectCurso curso={curso} onChange={ n => setCurso(n)}/>
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
                        <div className="grid grid-cols-3 gap-3">
                            {opcoesBeneficios.map((o) => (
                                <label key={o.valor} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={o.valor}
                                        checked={beneficios.includes(o.valor)}
                                        onChange={() => toggle(o.valor)}
                                        className="accent-primary"
                                    />
                                    {o.label}
                                </label>
                            ))}
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