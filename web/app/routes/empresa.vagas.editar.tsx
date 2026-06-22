import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../api/api";
import type { Vaga } from "../api/types";
import FormVaga from "../components/FormVaga";

export default function EditarVaga() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [valoresIniciais, setValoresIniciais] = useState<Vaga | null>(null);
    const [erros, setErros] = useState<Record<string, string>>({});
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        API.vagas.get(id!)
            .then((r) => {
                if (r.success && r.data?.vaga) setValoresIniciais(r.data.vaga);
                else setErros({ titulo: "Vaga não encontrada." });
            })
            .catch(() => setErros({ titulo: "Erro ao carregar a vaga." }))
            .finally(() => setCarregando(false));
    }, [id]);

    async function handleSubmit(dados: Vaga) {
        setErros({});
        try {
            const r = await API.vagas.update(id!, dados);

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
