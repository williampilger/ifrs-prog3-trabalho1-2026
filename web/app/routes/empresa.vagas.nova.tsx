import FormVaga, { type DadosVaga } from "../components/FormVaga";

export default function NovaVaga() {
    function handleSubmit(dados: DadosVaga) {
        console.log("Vaga criada:", dados);
        // depois: POST para a API
    }

    return (
        <FormVaga
            titulo="Cadastrar Vaga"
            descricao="Preencha os detalhes abaixo para publicar uma nova oportunidade de estágio para os alunos do IFRS."
            textoBotao="Publicar Vaga"
            onSubmit={handleSubmit}
        />
    );
}