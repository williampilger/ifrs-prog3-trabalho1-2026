-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pswd" TEXT NOT NULL,
    "telefone" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excluidoEm" DATETIME,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "areas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "usuario_area" (
    "usuarioId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,

    PRIMARY KEY ("usuarioId", "areaId"),
    CONSTRAINT "usuario_area_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usuario_area_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vagas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "turno" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "local" TEXT,
    "contatoNome" TEXT,
    "contatoTelefone" TEXT,
    "contatoEmail" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excluidoEm" DATETIME,
    CONSTRAINT "vagas_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vagas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "areas_nome_key" ON "areas"("nome");
