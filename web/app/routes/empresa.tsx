import { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { Link } from "react-router";
import type { Vaga } from "~/api/types";
import API from "../api/api";
import CardResumo from "../components/CardResumo";
import CardVaga from "../components/CardVaga";

function formatarRemuneracao(salario: number | null): string {
    if (!salario) return "A combinar";
    return salario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Empresa() {
    const [vagas, setVagas] = useState<Vaga[]>([]);

    useEffect(() => {
        API.vagas.list().then((r) => setVagas(r.data?.vagas ?? []));
    }, []);

    const vagasAtivas = vagas.filter((v) => !v.preenchida).length;

    return (
        <div>
            <section className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-text-secondary">Minhas vagas</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Gerencie as oportunidades de estágio da sua empresa
                    </p>
                </div>
                <Link
                    to="/empresa/vagas/nova"
                    className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <MdAddCircleOutline />
                    Cadastrar Nova Vaga
                </Link>
            </section>
            <section className="mt-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 flex flex-col gap-4">
                    {vagas.map((v) => (
                        <CardVaga
                            key={v.id}
                            id={v.id}
                            titulo={v.titulo}
                            descricao={v.descricao}
                            curso={v.area.nome}
                            local={v.local ?? "A definir"}
                            remuneracao={formatarRemuneracao(v.salario)}
                            statusInicial={v.preenchida}
                            onExcluir={(id) => setVagas((atual) => atual.filter((vaga) => vaga.id !== id))}
                        />
                    ))}
                    {vagas.length === 0 && (
                        <p className="text-sm text-text-muted">Nenhuma vaga cadastrada.</p>
                    )}
                </div>
                <div>
                    <CardResumo
                        titulo="Resumo"
                        cor="bg-primary"
                        itens={[
                            { numero: String(vagasAtivas), label: "Vagas Ativas" },
                            { numero: String(vagas.length), label: "Total de Vagas" },
                        ]}
                    />
                </div>
            </section>
        </div>
    );
}
