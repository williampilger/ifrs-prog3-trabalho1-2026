import { MdWarningAmber } from "react-icons/md";

type ModalConfirmProps = {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    onConfirmar: () => void;
    onCancelar: () => void;
};

export default function ModalConfirm({
    aberto,
    titulo,
    mensagem,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    onConfirmar,
    onCancelar,
}: ModalConfirmProps) {
    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onCancelar}
        >
            <div
                className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3">
                    <MdWarningAmber size={24} className="mt-0.5 shrink-0 text-danger" />
                    <div>
                        <h3 className="font-bold text-text-secondary">{titulo}</h3>
                        <p className="mt-1 text-sm text-text-muted">{mensagem}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancelar}
                        className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-secondary transition-colors"
                    >
                        {textoCancelar}
                    </button>
                    <button
                        onClick={onConfirmar}
                        className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger-dark transition-colors"
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}