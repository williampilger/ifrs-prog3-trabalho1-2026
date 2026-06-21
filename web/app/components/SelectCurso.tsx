export const opcoesCurso = [
    { valor: "Técnico em Administração", label: "Técnico em Administração" },
    { valor: "Técnico em Informática", label: "Técnico em Informática" },
    { valor: "Técnico em Meio Ambiente", label: "Técnico em Meio Ambiente" },
    { valor: "Técnico em Química", label: "Técnico em Química" },

    { valor: "Licenciatura em Letras – Português e Inglês", label: "Licenciatura em Letras – Português e Inglês" },
    { valor: "Licenciatura em Química", label: "Licenciatura em Química" },

    { valor: "Bacharelado em Engenharia Ambiental", label: "Bacharelado em Engenharia Ambiental" },
    { valor: "Bacharelado em Engenharia Química", label: "Bacharelado em Engenharia Química" },

    { valor: "Tecnologia em Análise e Desenvolvimento de Sistemas", label: "Tecnologia em Análise e Desenvolvimento de Sistemas" },
    { valor: "Tecnologia em Processos Gerenciais", label: "Tecnologia em Processos Gerenciais" },

    { valor: "Especialização em Gestão Escolar", label: "Especialização em Gestão Escolar" },
    { valor: "MBA em Gestão Empresarial", label: "MBA em Gestão Empresarial" },
    { valor: "Mestrado Profissional em Tecnologia e Engenharia de Materiais", label: "Mestrado Profissional em Tecnologia e Engenharia de Materiais" },
];

const SelectCurso = (props: { curso: string; onChange: (curso: string) => void }) => {
    return (
        <select
            value={props.curso}
            onChange={(e) => props.onChange(e.target.value)}
            className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
            <option value="">Selecione o curso</option>
            {opcoesCurso.map((c) => (
                <option key={c.valor} value={c.valor}>{c.label}</option>
            ))}
        </select>
    );
};

export default SelectCurso;
