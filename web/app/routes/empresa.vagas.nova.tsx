import { useState } from "react";
import { useNavigate } from "react-router";
import API from "../api/api";
import type { Vaga } from "../api/types";
import FormVaga from "../components/FormVaga";

export default function NovaVaga() {
    const [erros, setErros] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    async function handleSubmit(dados: Vaga) {
        setErros({});
        try {
            const r = await API.vagas.create(dados);

            if (!r.success) {
                if (r.data?.erros) setErros(r.data.erros);
                else setErros({ titulo: r.data?.mensagem ?? "Erro ao criar vaga." });
                return;
            }

            navigate("/empresa");
        } catch {
            setErros({ titulo: "Erro de conexão com o servidor." });
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
