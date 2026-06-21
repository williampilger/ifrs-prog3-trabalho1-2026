import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../api/api";
import type { Vaga } from "../api/types";
import FormVaga from "../components/FormVaga";

function vagaParaForm(vaga: Vaga): Vaga {
    const partes = vaga.descricao.split("\n\n");
    return {
        titulo: vaga.titulo,
        curso: vaga.area.nome,
        local: vaga.local ?? "",
        modalidade: vaga.modalidade,
        turno: vaga.turno,
        salario: vaga.salario != null ? String(vaga.salario) : "",
        beneficios: vaga.beneficios.map((b) => b.nome),
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

    const [valoresIniciais, setValoresIniciais] = useState<Vaga | null>(null);
    const [erros, setErros] = useState<Record<string, string>>({});
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        API.vagas.get(id!)
            .then((r) => {
                if (r.success && r.data?.vaga) setValoresIniciais(vagaParaForm(r.data.vaga));
                else setErros({ titulo: "Vaga não encontrada." });
            })
            .catch(() => setErros({ titulo: "Erro ao carregar a vaga." }))
            .finally(() => setCarregando(false));
    }, [id]);

    async function handleSubmit(dados: Vaga) {
        setErros({});
        try {
            const r = await API.vagas.update(id!, {
                titulo: dados.titulo,
                turno: dados.turno,
                modalidade: dados.modalidade,
                salario: dados.salario ? Number(dados.salario) : null,
                local: dados.local || null,
                descricaoAtividades: dados.descricaoAtividades,
                descricaoHabilidades: dados.descricaoHabilidades || undefined,
                beneficios: dados.beneficios,
                contatoNome: dados.contatoNome || null,
                contatoTelefone: dados.contatoTelefone || null,
                contatoEmail: dados.contatoEmail || null,
            });

            if (!r.success) {
                if (r.data?.erros) setErros(r.data.erros);
                else setErros({ titulo: r.data?.mensagem ?? "Erro ao salvar vaga." });
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
