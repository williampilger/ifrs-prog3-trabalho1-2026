-- CreateTable
CREATE TABLE "beneficios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "vaga_beneficio" (
    "vagaId" INTEGER NOT NULL,
    "beneficioId" INTEGER NOT NULL,

    PRIMARY KEY ("vagaId", "beneficioId"),
    CONSTRAINT "vaga_beneficio_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "vagas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vaga_beneficio_beneficioId_fkey" FOREIGN KEY ("beneficioId") REFERENCES "beneficios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vagas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "turno" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "salario" REAL,
    "preenchida" BOOLEAN NOT NULL DEFAULT false,
    "local" TEXT,
    "contatoNome" TEXT,
    "contatoTelefone" TEXT,
    "contatoEmail" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excluidoEm" DATETIME,
    CONSTRAINT "vagas_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vagas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_vagas" ("areaId", "contatoEmail", "contatoNome", "contatoTelefone", "criadoEm", "descricao", "empresaId", "excluidoEm", "id", "local", "modalidade", "titulo", "turno") SELECT "areaId", "contatoEmail", "contatoNome", "contatoTelefone", "criadoEm", "descricao", "empresaId", "excluidoEm", "id", "local", "modalidade", "titulo", "turno" FROM "vagas";
DROP TABLE "vagas";
ALTER TABLE "new_vagas" RENAME TO "vagas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "beneficios_nome_key" ON "beneficios"("nome");
