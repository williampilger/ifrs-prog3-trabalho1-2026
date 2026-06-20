import FormVaga, { type DadosVaga } from "../components/FormVaga";

// Mock da vaga sendo editada (depois virá do loader pela URL)
const vagaExistente: DadosVaga = {
    vaga: "Desenvolvedor Front-end Estagiário",
    curso: "cc",
    localidade: "Feliz, RS",
    modalidade: "presencial",
    cargaHoraria: "30h",
    salario: "1200",
    beneficios: ["vt", "vr"],
    descricaoAtividades: "Desenvolvimento de interfaces modernas com React e TypeScript, sempre acompanhado pela equipe.",
    descricaoHabilidades: "Conhecimento em HTML, CSS e JavaScript. Vontade de aprender e trabalhar em equipe.",
};

export default function EditarVaga() {
    function handleSubmit(dados: DadosVaga) {
        console.log("Vaga atualizada:", dados);
        // depois: PUT para a API
    }

    return (
        <FormVaga
            titulo="Editar Vaga"
            descricao="Altere os campos abaixo e salve as mudanças desta vaga de estágio."
            textoBotao="Salvar Alterações"
            valoresIniciais={vagaExistente}
            onSubmit={handleSubmit}
        />
    );
}