import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    route("login", "routes/login.tsx"),

    layout("layouts/publico.tsx", [
        index("routes/home.tsx"),
        route("cadastro", "routes/cadastro.tsx"),
    ]),

    layout("layouts/privado.tsx", [
        route("perfil", "routes/perfil.tsx"),
    ]),

    layout("layouts/privado-aluno.tsx", [
        route("aluno", "routes/aluno.tsx"),
        route("vagas/:id", "routes/vagas.detalhes.tsx"),
    ]),

    layout("layouts/privado-empresa.tsx", [
        route("empresa", "routes/empresa.tsx"),
        route("empresa/vagas/nova", "routes/empresa.vagas.nova.tsx"),
        route("empresa/vagas/editar/:id", "routes/empresa.vagas.editar.tsx"),
    ]),
] satisfies RouteConfig;
