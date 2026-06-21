-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pswd" TEXT NOT NULL,
    "telefone" TEXT,
    "nascimento" TEXT,
    "curso" TEXT,
    "cnpj" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excluidoEm" DATETIME,
    "tipo" TEXT NOT NULL
);
INSERT INTO "new_usuarios" ("cnpj", "criadoEm", "curso", "email", "excluidoEm", "id", "nascimento", "nome", "pswd", "telefone", "tipo") SELECT "cnpj", "criadoEm", "curso", "email", "excluidoEm", "id", "nascimento", "nome", "pswd", "telefone", "tipo" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
