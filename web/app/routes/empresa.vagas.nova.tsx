import { useState } from "react";
import { useNavigate } from "react-router";
import FormVaga, { type DadosVaga } from "../components/FormVaga";
import { api } from "../lib/api";

export default function NovaVaga() {
    const [erros, setErros] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    async function handleSubmit(dados: DadosVaga) {
        setErros({});
        try {
            const resposta = await api("/vagas", {
                method: "POST",
                body: JSON.stringify({
                    titulo: dados.titulo,
                    curso: dados.curso,
                    turno: dados.turno,
                    modalidade: dados.modalidade,
                    salario: dados.salario ? Number(dados.salario) : null,
                    local: dados.local || undefined,
                    descricaoAtividades: dados.descricaoAtividades,
                    descricaoHabilidades: dados.descricaoHabilidades || undefined,
                    beneficios: dados.beneficios,
                    contatoNome: dados.contatoNome || undefined,
                    contatoTelefone: dados.contatoTelefone || undefined,
                    contatoEmail: dados.contatoEmail || undefined,
                }),
            });

            const retorno = await resposta.json();

            if (!resposta.ok) {
                if (retorno.erros) setErros(retorno.erros);
                else setErros({ titulo: retorno.mensagem ?? "Erro ao criar vaga." });
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
