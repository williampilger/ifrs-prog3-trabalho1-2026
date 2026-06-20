import { useState } from "react";
import { useNavigate } from "react-router";
import FormVaga, { type DadosVaga } from "../components/FormVaga";

export default function NovaVaga() {
    const [erros, setErros] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    async function handleSubmit(dados: DadosVaga) {
        setErros({});
        try {
            const resposta = await fetch("http://localhost:3333/vagas", {
                method: "POST",
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
            titulo="Cadastrar Vaga"
            descricao="Preencha os detalhes abaixo para publicar uma nova oportunidade de estágio para os alunos do IFRS."
            textoBotao="Publicar Vaga"
            erros={erros}
            onSubmit={handleSubmit}
        />
    );
}