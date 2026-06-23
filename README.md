# Sistema de Vagas de Estágios

> Desenvolvido para entrega como tarefa da disciplina de `Programação III` do curso de `Análise e Desenvolvimento de Sistemas` do `IFRS - Campus Feliz`.
>
> Alunos:
> - Felipe Gerhard Ledur
> - William Pilger

Prototipo: https://www.figma.com/design/vDjcTzuuNJVd1vlpg5hcm8/Daily-UI?node-id=0-1&t=xH8LEgJP18sTBvFv-1

---


Para rodar o projeto:

> No **Terminal 1**, execute o Front-End:
> ```
> cd web
> npm i
> npm run dev
> ```

> No **Terminal 2**, execute o Back-End:
> ```
> cd server
> npm i
> npx prisma generate
> npm run dev
> ```

> ⚠️ **Atenção**: Se você não tiver o banco de dados (que é o arquivo `dev.db`), você pode criar um novo banco de dados, após o `npx prisma generate`, com o comando:
> ```
> npx prisma migrate deploy
> ```
> Mas, por padrão, um banco de exemplo já está incluso neste repositório (como esta é uma entrega de trabalho, ele já vem junto e populado).
