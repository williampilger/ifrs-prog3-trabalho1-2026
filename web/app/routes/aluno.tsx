import { useEffect, useState } from "react";
import type { Vaga } from "~/api/types";
import API from "../api/api";
import Campo from "../components/Campo";
import Card from "../components/Card";
import CardVagaDisponivel from "../components/CardVagaDisponivel";
import SelectCurso from "../components/SelectCurso";

function formatarRemuneracao(salario: number | null): string {
    if (!salario) return "A combinar";
    return salario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function nomeEmpresa(vaga: Vaga): string {
    return vaga.empresa?.nome ?? "";
}

export default function Aluno() {
    const [pesquisa, setPesquisa] = useState("");
    const [curso, setCurso] = useState("");
    const [cidade, setCidade] = useState("");
    const [vagas, setVagas] = useState<Vaga[]>([]);

    useEffect(() => {
        API.vagas.listDisponiveis().then((r) => setVagas(r.data?.vagas ?? []));
    }, []);

    const vagasFiltradas = vagas
        .filter((v) => !v.preenchida)
        .filter((v) =>
            pesquisa === "" ||
            v.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
            nomeEmpresa(v).toLowerCase().includes(pesquisa.toLowerCase())
        )
        .filter((v) => curso === "" || v.area.nome === curso)
        .filter((v) =>
            cidade === "" ||
            (v.local ?? "").toLowerCase().includes(cidade.toLowerCase())
        );

    return (
        <div>
            <section className="grid grid-cols-6 gap-8">
                <div className="col-span-2">
                    <Card className="w-full bg-background border border-border">
                        <h3>Filtros</h3>
                        <Campo
                            label="Pesquisar"
                            type="text"
                            placeholder="Digite o nome da vaga"
                            value={pesquisa}
                            onChange={setPesquisa}
                        />
                        <div className="flex flex-col gap-1 mt-4">
                            <label className="text-sm font-medium text-text-primary">Curso</label>
                            <SelectCurso curso={curso} onChange={setCurso} />
                        </div>
                        <div className="flex flex-col gap-1 mt-4">
                            <Campo
                                label="Cidade"
                                type="text"
                                placeholder="Ex: Feliz, RS"
                                value={cidade}
                                onChange={setCidade}
                            />
                        </div>
                    </Card>
                </div>
                <div className="col-span-4">
                    <section className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-text-secondary">
                            Oportunidades Disponíveis
                        </h2>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide bg-secondary text-text-primary">
                            {vagasFiltradas.length} {vagasFiltradas.length === 1 ? "vaga encontrada" : "vagas encontradas"}
                        </span>
                    </section>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {vagasFiltradas.map((v) => (
                            <CardVagaDisponivel
                                key={v.id}
                                id={v.id}
                                titulo={v.titulo}
                                empresa={nomeEmpresa(v)}
                                curso={v.area.nome}
                                local={v.local ?? "A definir"}
                                remuneracao={formatarRemuneracao(v.salario)}
                            />
                        ))}
                        {vagasFiltradas.length === 0 && (
                            <p className="col-span-2 text-sm text-text-muted">Nenhuma vaga encontrada.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
