/*
  Warnings:

  - You are about to drop the `vaga_beneficio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "vaga_beneficio";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_BeneficioToVaga" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BeneficioToVaga_A_fkey" FOREIGN KEY ("A") REFERENCES "beneficios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BeneficioToVaga_B_fkey" FOREIGN KEY ("B") REFERENCES "vagas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_BeneficioToVaga_AB_unique" ON "_BeneficioToVaga"("A", "B");

-- CreateIndex
CREATE INDEX "_BeneficioToVaga_B_index" ON "_BeneficioToVaga"("B");
