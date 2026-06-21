const SelectCurso = (props: {curso:string, onChange: (curso:string)=>void}) => {

    return(
        <select
            value={props.curso}
            onChange={(e) => props.onChange(e.target.value)}
            className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
            <option value="">Selecione seu curso</option>
            <option value="info">Informática</option>
            <option value="quimica">Química</option>
            <option value="admin">Administração</option>
            {/* <option value="ads">Análise e Desenvolvimento de Sistemas</option> */}
        </select>
    )
}

export default SelectCurso;