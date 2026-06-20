import { useState } from "react";
import Campo from "../components/Campo";
import Card from "../components/Card";
import CardVagaDisponivel from "../components/CardVagaDisponivel";

export default function Aluno() {
    const [pesquisa, setPesquisa] = useState("");
    const [curso, setCurso] = useState("");

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
                            <select
                                value={curso}
                                onChange={(e) => setCurso(e.target.value)}
                                className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Selecione seu curso</option>
                                <option value="info">Informática</option>
                                <option value="quimica">Química</option>
                                <option value="admin">Administração</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 mt-4">
                            <label className="text-sm font-medium text-text-primary">Cidade</label>
                            <select
                                value={curso}
                                onChange={(e) => setCurso(e.target.value)}
                                className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Selecione a cidade</option>
                                <option value="bomPrincipio">Bom Princípio</option>
                                <option value="feliz">Feliz</option>
                                <option value="saoSebastiao">São Sebastião do Caí</option>
                            </select>
                        </div>
                    </Card>
                </div>
                <div className="col-span-4">
                    <section className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-text-secondary">
                            Oportunidades Disponíveis
                        </h2>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide bg-secondary text-text-primary">
                            12 vagas encontradas
                        </span>
                    </section>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <CardVagaDisponivel
                            titulo="Estágio em Desenvolvimento Web"
                            empresa="Tech Solutions"
                            curso="Ciência da Computação"
                            local="Porto Alegre, RS"
                            remuneracao="R$ 1.500,00"
                        />
                        <CardVagaDisponivel
                            titulo="Estágio em Desenvolvimento Web"
                            empresa="Tech Solutions"
                            curso="Ciência da Computação"
                            local="Porto Alegre, RS"
                            remuneracao="R$ 1.500,00"
                        />
                        <CardVagaDisponivel
                            titulo="Estágio em Desenvolvimento Web"
                            empresa="Tech Solutions"
                            curso="Ciência da Computação"
                            local="Porto Alegre, RS"
                            remuneracao="R$ 1.500,00"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
