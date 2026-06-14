"use client";

import { useState } from "react";
import Card from "./Card";
import { MdSchool, MdLocationOn, MdAttachMoney, MdCheckCircleOutline, MdEdit, MdDelete, MdCheckCircle } from "react-icons/md";

type CardVagaProps = {
  titulo: string;
  descricao: string;
  curso: string;
  local: string;
  remuneracao: string;
  statusInicial?: boolean; // true = preenchida
};

export default function CardVaga({
  titulo,
  descricao,
  curso,
  local,
  remuneracao,
  statusInicial = false,
}: CardVagaProps) {
  const [preenchida, setPreenchida] = useState(statusInicial);

  const corIcone = preenchida ? "text-text-muted" : "text-primary";
  const corTexto = preenchida ? "text-text-muted" : "text-text-primary";

  return (
    <Card className="bg-white border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${
              preenchida ? "bg-secondary text-text-muted" : "bg-background-success text-primary"
            }`}>
              {preenchida ? "Preenchida" : "Ativa"}
            </span>
            <h2 className={`text-lg font-bold ${preenchida ? "text-text-muted" : "text-text-secondary"}`}>
              {titulo}
            </h2>
          </div>

          <p className="mt-2 text-sm text-text-muted">{descricao}</p>

          <div className={`mt-4 flex flex-wrap items-center gap-6 ${corTexto}`}>
            <span className="flex items-center gap-1.5">
              <MdSchool className={corIcone} />
              <span>{curso}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MdLocationOn className={corIcone} />
              <span>{local}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MdAttachMoney className={corIcone} />
              <span>{remuneracao}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 self-stretch">
          <button className="text-text-primary hover:text-primary" title="Editar">
            <MdEdit size={24} />
          </button>
          <button
            onClick={() => setPreenchida((v) => !v)}
            className={preenchida ? "text-primary" : "text-text-muted hover:text-primary"}
            title={preenchida ? "Marcar como ativa" : "Marcar como preenchida"}
          >
            {preenchida ? <MdCheckCircle size={24} /> : <MdCheckCircleOutline size={24} />}
          </button>
          <button className="text-danger hover:text-danger-dark" title="Excluir">
            <MdDelete size={24} />
          </button>
        </div>
      </div>
    </Card>
  );
}