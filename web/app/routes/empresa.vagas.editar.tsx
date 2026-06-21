import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import FormVaga, { type DadosVaga } from "../components/FormVaga";
import { api } from "../lib/api";

function vagaParaForm(vaga: any): DadosVaga {
    const partes = (vaga.descricao as string).split("\n\n");
    return {
        titulo: vaga.titulo,
        curso: vaga.area?.nome ?? "",
        local: vaga.local ?? "",
        modalidade: vaga.modalidade,
        turno: vaga.turno,
        salario: vaga.salario != null ? String(vaga.salario) : "",
        beneficios: (vaga.beneficios as any[]).map((vb) => vb.beneficio.nome),
        descricaoAtividades: partes[0] ?? "",
        descricaoHabilidades: partes.slice(1).join("\n\n"),
        contatoNome: vaga.contatoNome ?? "",
        contatoTelefone: vaga.contatoTelefone ?? "",
        contatoEmail: vaga.contatoEmail ?? "",
    };
}

export default function EditarVaga() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [valoresIniciais, setValoresIniciais] = useState<DadosVaga | null>(null);
    const [erros, setErros] = useState<Record<string, string>>({});
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        api(`/vagas/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.vaga) setValoresIniciais(vagaParaForm(data.vaga));
                else setErros({ titulo: "Vaga não encontrada." });
            })
            .catch(() => setErros({ titulo: "Erro ao carregar a vaga." }))
            .finally(() => setCarregando(false));
    }, [id]);

    async function handleSubmit(dados: DadosVaga) {
        setErros({});
        try {
            const resposta = await api(`/vagas/${id}`, {
                method: "PUT",
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
                else setErros({ titulo: retorno.mensagem ?? "Erro ao salvar vaga." });
                return;
            }

            navigate("/empresa");
        } catch {
            setErros({ titulo: "Erro de conexão com o servidor." });
        }
    }

    if (carregando) {
        return <p className="text-sm text-text-muted p-8">Carregando...</p>;
    }

    if (!valoresIniciais) {
        return <p className="text-sm text-red-600 p-8">{erros.titulo ?? "Vaga não encontrada."}</p>;
    }

    return (
        <FormVaga
            titulo="Editar Vaga"
            descricao="Altere os campos abaixo e salve as mudanças desta vaga de estágio."
            textoBotao="Salvar Alterações"
            valoresIniciais={valoresIniciais}
            erros={erros}
            onSubmit={handleSubmit}
        />
    );
}
