import { useState } from "react";
import Campo from "../components/Campo";
import Card from "../components/Card";
import CardVagaDisponivel from "../components/CardVagaDisponivel";

export default function Aluno() {
    const [pesquisa, setPesquisa] = useState("");

    return (
        <div>
            <section className="grid grid-cols-5 gap-8">
                <div className="col-span-1">
                    <Card className="w-full bg-background border border-border">
                        <h3>Filtros</h3>
                        <Campo
                            label="Pesquisar"
                            type="text"
                            placeholder="Digite o nome da vaga"
                            value={pesquisa}
                            onChange={setPesquisa}
                        />
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
