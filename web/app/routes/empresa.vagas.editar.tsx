import { useState } from "react";
import { useNavigate } from "react-router";
import FormVaga, { type DadosVaga } from "../components/FormVaga";

// Mock da vaga sendo editada (depois virá do loader pela URL)
const vagaExistente: DadosVaga = {
    vaga: "Desenvolvedor Front-end Estagiário",
    curso: "cc",
    localidade: "Feliz, RS",
    modalidade: "presencial",
    cargaHoraria: "30h",
    salario: "1200",
    beneficios: ["Vale Transporte", "Vale Refeição/Alimentação"],
    descricaoAtividades: "Desenvolvimento de interfaces modernas com React e TypeScript, sempre acompanhado pela equipe.",
    descricaoHabilidades: "Conhecimento em HTML, CSS e JavaScript. Vontade de aprender e trabalhar em equipe.",
};

export default function EditarVaga() {
    const [erros, setErros] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    async function handleSubmit(dados: DadosVaga) {
        setErros({});
        try {
            const resposta = await fetch("http://localhost:3333/vagas/1", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(dados),
            });

            const retorno = await resposta.json();

            if (!resposta.ok) {
                if (retorno.erros) setErros(retorno.erros);
                return;
            }

            navigate("/empresa");
        } catch {
            setErros({ vaga: "Erro de conexão com o servidor." });
        }
    }

    return (
        <FormVaga
            titulo="Editar Vaga"
            descricao="Altere os campos abaixo e salve as mudanças desta vaga de estágio."
            textoBotao="Salvar Alterações"
            valoresIniciais={vagaExistente}
            erros={erros}
            onSubmit={handleSubmit}
        />
    );
}