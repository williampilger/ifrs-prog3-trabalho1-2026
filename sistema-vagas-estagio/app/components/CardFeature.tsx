import Card from "./Card";

type CardFeatureProps = {
  titulo: string;
  texto: string;
  icone: React.ReactNode;
};

export default function CardFeature({ titulo, texto, icone }: CardFeatureProps) {
  return (
    <Card className="bg-background border border-border">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-lg text-white">
        {icone}
      </div>
      <h3 className="mt-4 text-lg font-bold text-text-secondary">{titulo}</h3>
      <p className="mt-2 text-sm text-text-muted">{texto}</p>
    </Card>
  );
}