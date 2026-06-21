
export const opcoesCurso = [
    { valor: "adm", label: "Técnico em Administração" },
    { valor: "ti", label: "Técnico em Informática" },
    { valor: "ma", label: "Técnico em Meio Ambiente" },
    { valor: "qui", label: "Técnico em Química" },

    { valor: "letras", label: "Licenciatura em Letras – Português e Inglês" },
    { valor: "lic-quimica", label: "Licenciatura em Química" },

    { valor: "eng-ambiental", label: "Bacharelado em Engenharia Ambiental" },
    { valor: "eng-quimica", label: "Bacharelado em Engenharia Química" },

    { valor: "ads", label: "Tecnologia em Análise e Desenvolvimento de Sistemas" },
    { valor: "pg", label: "Tecnologia em Processos Gerenciais" },

    { valor: "gestao-escolar", label: "Especialização em Gestão Escolar" },
    { valor: "mba", label: "MBA em Gestão Empresarial" },
    { valor: "mestrado-materiais", label: "Mestrado Profissional em Tecnologia e Engenharia de Materiais" }
];

const SelectCurso = (props: {curso:string, onChange: (curso:string)=>void}) => {

    return(
        <select
            value={props.curso}
            onChange={(e) => props.onChange(e.target.value)}
            className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
            <option value="">Selecione o curso</option>
            {
                opcoesCurso.map(c => (
                    <option key={c.valor} value={c.valor}>{c.label}</option>
                ))
            }
        </select>
    )
}

export default SelectCurso;