
import Card from "@/app/components/Card";
import Link from "next/link";
import { MdAddCircleOutline} from "react-icons/md";
import CardVaga from "@/app/components/CardVaga";

export default function Empresa() {
    return (
        <div>
            <section className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-text-secondary">Minhas vagas </h1>
                    <p className="mt-1 text-sm text-text-muted">Gerencie as oportunidades de estágio da sua empresa</p>
                </div>
                <Link href="/empresa/vagas/nova" className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2">
                    <MdAddCircleOutline />
                    Cadastrar Nova Vaga
                </Link>
            </section>
            <section className="mt-8 grid grid-cols-1 gap-6">
                <CardVaga />
                <CardVaga />
            </section>
        </div>
        
    )
}