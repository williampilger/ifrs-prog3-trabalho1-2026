import { createHash } from "crypto";
import { prisma } from "../src/lib/prisma.js";

const md5 = (s: string) => createHash("md5").update(s).digest("hex");

async function main() {
    // As "áreas" agora correspondem aos cursos do IFRS Campus Feliz.
    // São os mesmos nomes usados no SelectCurso do frontend, para que o
    // filtro por curso (aluno.tsx) encontre correspondência.
    const nomesCursos = [
        "Técnico em Administração",
        "Técnico em Informática",
        "Técnico em Meio Ambiente",
        "Técnico em Química",
        "Licenciatura em Letras – Português e Inglês",
        "Licenciatura em Química",
        "Bacharelado em Engenharia Ambiental",
        "Bacharelado em Engenharia Química",
        "Tecnologia em Análise e Desenvolvimento de Sistemas",
        "Tecnologia em Processos Gerenciais",
        "Especialização em Gestão Escolar",
        "MBA em Gestão Empresarial",
        "Mestrado Profissional em Tecnologia e Engenharia de Materiais",
    ];

    await Promise.all(
        nomesCursos.map((nome) =>
            prisma.area.upsert({
                where: { nome },
                update: {},
                create: { nome },
            })
        )
    );

    const beneficios = await Promise.all([
        prisma.beneficio.upsert({
            where: { nome: "Vale Transporte" },
            update: {},
            create: { nome: "Vale Transporte" },
        }),
        prisma.beneficio.upsert({
            where: { nome: "Vale Refeição/Alimentação" },
            update: {},
            create: { nome: "Vale Refeição/Alimentação" },
        }),
        prisma.beneficio.upsert({
            where: { nome: "Seguro de Vida" },
            update: {},
            create: { nome: "Seguro de Vida" },
        }),
        prisma.beneficio.upsert({
            where: { nome: "Auxílio Remoto" },
            update: {},
            create: { nome: "Auxílio Remoto" },
        }),
        prisma.beneficio.upsert({
            where: { nome: "Plano de Saúde" },
            update: {},
            create: { nome: "Plano de Saúde" },
        }),
    ]);

    const senha = md5("Teste53!");

    const usuarios = await Promise.all([
        prisma.usuario.upsert({
            where: { email: "aluno1@localhost.com.br" },
            update: {},
            create: {
                nome: "Aluno Primeiro",
                email: "aluno1@localhost.com.br",
                pswd: senha,
                tipo: "aluno",
            },
        }),
        prisma.usuario.upsert({
            where: { email: "aluno2@localhost.com.br" },
            update: {},
            create: {
                nome: "Aluno Segundo",
                email: "aluno2@localhost.com.br",
                pswd: senha,
                tipo: "aluno",
            },
        }),
        prisma.usuario.upsert({
            where: { email: "empresa1@localhost.com.br" },
            update: {},
            create: {
                nome: "Empresa Primeira",
                email: "empresa1@localhost.com.br",
                pswd: senha,
                tipo: "empresa",
            },
        }),
        prisma.usuario.upsert({
            where: { email: "empresa2@localhost.com.br" },
            update: {},
            create: {
                nome: "Empresa Segunda",
                email: "empresa2@localhost.com.br",
                pswd: senha,
                tipo: "empresa",
            },
        }),
    ]);

    const [, , empresa1, empresa2] = usuarios;

    // Busca as áreas/cursos pelos nomes (não depende da ordem de criação).
    const areaInformatica = await prisma.area.findUniqueOrThrow({
        where: { nome: "Técnico em Informática" },
    });
    const areaADS = await prisma.area.findUniqueOrThrow({
        where: { nome: "Tecnologia em Análise e Desenvolvimento de Sistemas" },
    });

    const [vt, vr, , auxilioRemoto] = beneficios;

    await Promise.all([
        prisma.vaga.upsert({
            where: { id: 1 },
            update: {},
            create: {
                titulo: "Estágio em TI",
                descricao: "Manutenção de computadores",
                areaId: areaInformatica.id,
                empresaId: empresa1.id,
                local: "Bom Princípio",
                contatoNome: "Pessoa A",
                contatoTelefone: "5551999999999",
                contatoEmail: "rh@empresa1.com.br",
                turno: "integral",
                modalidade: "presencial",
                salario: 1200,
                beneficios: {
                    connect: [{ id: vt.id }, { id: vr.id }],
                },
            },
        }),
        prisma.vaga.upsert({
            where: { id: 2 },
            update: {},
            create: {
                titulo: "Trabalho B",
                descricao: "Manutenção de computadores",
                areaId: areaADS.id,
                empresaId: empresa2.id,
                local: "Feliz",
                contatoNome: "Pessoa B",
                contatoTelefone: "5551999999999",
                contatoEmail: "rh@empresa1.com.br",
                turno: "integral",
                modalidade: "remoto",
                salario: 1500,
                beneficios: {
                    connect: [{ id: vt.id }, { id: auxilioRemoto.id }],
                },
            },
        }),
    ]);

    console.log("Seed concluído.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());