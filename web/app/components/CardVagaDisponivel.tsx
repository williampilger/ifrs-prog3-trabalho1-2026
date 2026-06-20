import { Link } from "react-router";
import Card from "./Card";
import { MdSchool, MdLocationOn } from "react-icons/md";

type CardVagaDisponivelProps = {
    titulo: string;
    empresa: string;
    curso: string;
    local: string;
    remuneracao: string;
};

export default function CardVagaDisponivel({
    titulo,
    empresa,
    curso,
    local,
    remuneracao,
}: CardVagaDisponivelProps) {
    return (
        <Card className="w-full bg-background border border-border">
            <h3 className="mt-4 text-xl font-bold text-text-secondary">{titulo}</h3>
            <h4 className="mt-2 text-sm font-medium text-text-secondary">{empresa}</h4>
            <div className="mt-4 flex flex-col gap-2 text-sm text-text-primary">
                <span className="flex items-center gap-2 text-text-secondary">
                    <MdLocationOn className="text-text-muted" />
                    {local}
                </span>
                <span className="flex items-center gap-2 text-text-secondary">
                    <MdSchool className="text-text-muted" />
                    {curso}
                </span>
            </div>
            <hr className="my-5 border-border" />
            <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{remuneracao} /mês</span>
                <Link
                    to="/vagas/detalhes"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                >
                    Ver Detalhes
                </Link>
            </div>
        </Card>
    );
}
