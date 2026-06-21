import { useState } from "react";
import { useNavigate } from "react-router";
import API from "../api/api";
import FormVaga, { type DadosVaga } from "../components/FormVaga";

export default function NovaVaga() {
    const [erros, setErros] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    async function handleSubmit(dados: DadosVaga) {
        setErros({});
        try {
            const r = await API.vagas.create({
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
            });

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
