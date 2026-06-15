import Card from "@/app/components/Card";

export default function Aluno() {
    return (
        <div>
            <section className="grid grid-cols-5 gap-8">
                <div className="col-span-1">
                    <Card className="w-full bg-background border border-border">
                        <h3>Filtros</h3>
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
                </div>
            </section>
        </div>
    );
}