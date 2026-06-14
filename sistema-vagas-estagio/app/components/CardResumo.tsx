import Card from "./Card";

type CardResumoProps = {
  titulo: string;
  cor?: string;
  itens: { numero: string; label: string }[];
};

export default function CardResumo({
  titulo,
  cor = "bg-primary",
  itens,
}: CardResumoProps) {
  return (
    <Card className={`${cor} text-white`}>
      <h3 className="text-lg font-bold text-white">{titulo}</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {itens.map((item) => (
          <div key={item.label} className="rounded-xl bg-white/10 p-4">
            <p className="text-3xl font-bold text-white">{item.numero}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/80">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}