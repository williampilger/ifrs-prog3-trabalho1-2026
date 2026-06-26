import { createHash } from "crypto";
import { prisma } from "../src/lib/prisma.js";

const md5 = (s: string) => createHash("md5").update(s).digest("hex");

async function main() {
    const senhaPadrao = "Senha123!";
    const senhaHash = md5(senhaPadrao);

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

    const beneficiosNomes = [
        "Vale Transporte",
        "Vale Refeição/Alimentação",
        "Seguro de Vida",
        "Auxílio Remoto",
        "Plano de Saúde",
    ];

    const empresasSeed: {
        nome: string;
        email: string;
        cnpj: string;
        telefone: string;
        cidade: string;
        vagas: number;
    }[] = [
        { nome: "Tramontina", email: "empresa01@localhost.com.br", cnpj: "92.123.456/0001-01", telefone: "(54) 3458-0101", cidade: "Carlos Barbosa", vagas: 5 },
        { nome: "Cooperativa Santa Clara", email: "empresa02@localhost.com.br", cnpj: "92.123.456/0001-02", telefone: "(54) 3458-0102", cidade: "Carlos Barbosa", vagas: 4 },
        { nome: "Soprano", email: "empresa03@localhost.com.br", cnpj: "92.123.456/0001-03", telefone: "(54) 3458-0103", cidade: "Farroupilha", vagas: 5 },
        { nome: "Piccadilly Calçados", email: "empresa04@localhost.com.br", cnpj: "92.123.456/0001-04", telefone: "(51) 3458-0104", cidade: "Igrejinha", vagas: 3 },
        { nome: "Fruki Bebidas", email: "empresa05@localhost.com.br", cnpj: "92.123.456/0001-05", telefone: "(51) 3458-0105", cidade: "Lajeado", vagas: 4 },
        { nome: "Docile Alimentos", email: "empresa06@localhost.com.br", cnpj: "92.123.456/0001-06", telefone: "(51) 3458-0106", cidade: "Lajeado", vagas: 5 },
        { nome: "Calçados Beira Rio", email: "empresa07@localhost.com.br", cnpj: "92.123.456/0001-07", telefone: "(51) 3458-0107", cidade: "Novo Hamburgo", vagas: 3 },
        { nome: "Randoncorp", email: "empresa08@localhost.com.br", cnpj: "92.123.456/0001-08", telefone: "(54) 3458-0108", cidade: "Caxias do Sul", vagas: 4 },
        { nome: "Unimed Vale do Caí e Região", email: "empresa09@localhost.com.br", cnpj: "92.123.456/0001-09", telefone: "(51) 3458-0109", cidade: "Montenegro", vagas: 2 },
        { nome: "Sicredi Pioneira", email: "empresa10@localhost.com.br", cnpj: "92.123.456/0001-10", telefone: "(51) 3458-0110", cidade: "Regional Vale do Caí", vagas: 5 },
    ];

    const alunosSeed: {
        nome: string;
        email: string;
        nascimento: string;
        curso: string;
    }[] = Array.from({ length: 50 }, (_, indice) => {
        const primeirosNomes = ["Ana", "Bruno", "Camila", "Daniel", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João"];
        const sobrenomes = ["Silva", "Oliveira", "Costa", "Ribeiro", "Martins"];
        const primeiroNome = primeirosNomes[indice % primeirosNomes.length];
        const sobrenome = sobrenomes[Math.floor(indice / primeirosNomes.length)];
        const numero = String(indice + 1).padStart(2, "0");
        const ano = 2004 + Math.floor(indice / 13);
        const mes = String((indice % 12) + 1).padStart(2, "0");
        const dia = String(((indice * 3) % 28) + 1).padStart(2, "0");

        return {
            nome: `${primeiroNome} ${sobrenome}`,
            email: `aluno${numero}@localhost.com.br`,
            nascimento: `${ano}-${mes}-${dia}`,
            curso: nomesCursos[indice % nomesCursos.length]!,
        };
    });

    const vagasModelos:{
        titulo: string;
        descricao: string;
        area: string;
        turno: "integral" | "manha" | "tarde" | "noite";
        modalidade: "presencial" | "remoto" | "hibrido";
        salario: number;
        beneficios: string[];
    }[] = [
        { titulo: "Estágio em Administração", descricao: "Apoio ao controle de documentos, atendimento interno e rotinas de escritório.", area: "Técnico em Administração", turno: "manha", modalidade: "presencial", salario: 1350, beneficios: ["Vale Transporte", "Vale Refeição/Alimentação"] },
        { titulo: "Estágio em TI", descricao: "Suporte a usuários, configuração de equipamentos e organização de chamados.", area: "Tecnologia em Análise e Desenvolvimento de Sistemas", turno: "tarde", modalidade: "hibrido", salario: 1550, beneficios: ["Vale Transporte", "Auxílio Remoto"] },
        { titulo: "Estágio em Qualidade", descricao: "Acompanhamento de processos, conferência de padrões e registro de indicadores.", area: "Técnico em Química", turno: "integral", modalidade: "presencial", salario: 1450, beneficios: ["Vale Transporte", "Seguro de Vida"] },
        { titulo: "Estágio em Meio Ambiente", descricao: "Apoio em gestão de resíduos, documentação técnica e ações de sustentabilidade.", area: "Técnico em Meio Ambiente", turno: "manha", modalidade: "presencial", salario: 1400, beneficios: ["Vale Transporte", "Plano de Saúde"] },
        { titulo: "Estágio em Processos", descricao: "Suporte em planejamento, controles internos e melhoria de processos.", area: "Tecnologia em Processos Gerenciais", turno: "tarde", modalidade: "hibrido", salario: 1500, beneficios: ["Vale Refeição/Alimentação", "Plano de Saúde"] },
        { titulo: "Estágio em Comunicação", descricao: "Apoio à revisão de textos, atendimento e produção de materiais internos.", area: "Licenciatura em Letras – Português e Inglês", turno: "noite", modalidade: "remoto", salario: 1300, beneficios: ["Vale Transporte", "Auxílio Remoto"] },
        { titulo: "Estágio em Engenharia Ambiental", descricao: "Suporte em medições, documentação de campo e rotinas de laboratório.", area: "Bacharelado em Engenharia Ambiental", turno: "integral", modalidade: "hibrido", salario: 1650, beneficios: ["Vale Transporte", "Vale Refeição/Alimentação"] },
        { titulo: "Estágio em Engenharia Química", descricao: "Apoio em análises, controle de qualidade e documentação de produção.", area: "Bacharelado em Engenharia Química", turno: "tarde", modalidade: "presencial", salario: 1700, beneficios: ["Vale Transporte", "Seguro de Vida"] },
        { titulo: "Estágio em Letras", descricao: "Apoio a treinamentos internos, revisão de documentos e comunicação corporativa.", area: "Licenciatura em Letras – Português e Inglês", turno: "manha", modalidade: "remoto", salario: 1280, beneficios: ["Auxílio Remoto"] },
        { titulo: "Estágio em Gestão Empresarial", descricao: "Apoio em rotinas financeiras, compras e controle de indicadores de negócio.", area: "MBA em Gestão Empresarial", turno: "integral", modalidade: "presencial", salario: 1750, beneficios: ["Vale Transporte", "Vale Refeição/Alimentação", "Plano de Saúde"] },
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

    const beneficios = await Promise.all(
        beneficiosNomes.map((nome) =>
            prisma.beneficio.upsert({
                where: { nome },
                update: {},
                create: { nome },
            })
        )
    );

    const beneficioPorNome = new Map(beneficios.map((beneficio) => [beneficio.nome, beneficio]));

    await Promise.all(
        empresasSeed.map((empresa) =>
            prisma.usuario.upsert({
                where: { email: empresa.email },
                update: {
                    nome: empresa.nome,
                    pswd: senhaHash,
                    telefone: empresa.telefone,
                    cnpj: empresa.cnpj,
                    tipo: "empresa",
                    nascimento: null,
                    curso: null,
                },
                create: {
                    nome: empresa.nome,
                    email: empresa.email,
                    pswd: senhaHash,
                    telefone: empresa.telefone,
                    tipo: "empresa",
                    cnpj: empresa.cnpj,
                },
            })
        )
    );

    await Promise.all(
        alunosSeed.map((aluno) =>
            prisma.usuario.upsert({
                where: { email: aluno.email },
                update: {
                    nome: aluno.nome,
                    pswd: senhaHash,
                    telefone: null,
                    tipo: "aluno",
                    nascimento: aluno.nascimento,
                    curso: aluno.curso,
                    cnpj: null,
                },
                create: {
                    nome: aluno.nome,
                    email: aluno.email,
                    pswd: senhaHash,
                    tipo: "aluno",
                    nascimento: aluno.nascimento,
                    curso: aluno.curso,
                },
            })
        )
    );

    const empresasCriadas = await prisma.usuario.findMany({
        where: {
            email: {
                in: empresasSeed.map((empresa) => empresa.email),
            },
        },
        select: {
            id: true,
            email: true,
            nome: true,
        },
    });

    await prisma.vaga.deleteMany({
        where: {
            empresaId: {
                in: empresasCriadas.map((empresa) => empresa.id),
            },
        },
    });

    const areasCriadas = await prisma.area.findMany({
        where: {
            nome: {
                in: nomesCursos,
            },
        },
    });

    const areaPorNome = new Map(areasCriadas.map((area) => [area.nome, area]));

    for (const [indice, empresa] of empresasCriadas.entries()) {
        const empresaSeed = empresasSeed[indice];

        if (!empresaSeed) {
            throw new Error(`Empresa não encontrada no seed para o índice ${indice}.`);
        }

        for (let vagaIndex = 0; vagaIndex < empresaSeed.vagas; vagaIndex += 1) {
            const modelo = vagasModelos[(indice + vagaIndex) % vagasModelos.length];

            if (!modelo) {
                throw new Error(`Modelo de vaga não encontrado para o índice ${indice}.${vagaIndex}`);
            }

            const area = areaPorNome.get(modelo.area);

            if (!area) {
                throw new Error(`Área não encontrada no seed: ${modelo.area}`);
            }

            const beneficioIds = modelo.beneficios
                .map((nome) => beneficioPorNome.get(nome)?.id)
                .filter((id): id is number => typeof id === "number");

            await prisma.vaga.create({
                data: {
                    titulo: modelo.titulo,
                    descricao: `${modelo.descricao} Empresa: ${empresaSeed.nome}.`,
                    areaId: area.id,
                    empresaId: empresa.id,
                    turno: modelo.turno,
                    modalidade: modelo.modalidade,
                    salario: modelo.salario,
                    local: empresaSeed.cidade,
                    contatoNome: `RH ${empresaSeed.nome}`,
                    contatoTelefone: empresaSeed.telefone,
                    contatoEmail: `rh${indice + 1}@${empresaSeed.email.split("@")[1]}`,
                    beneficios: {
                        connect: beneficioIds.map((id) => ({ id })),
                    },
                },
            });
        }
    }

    console.log(`Seed concluído: ${empresasSeed.length} empresas, ${alunosSeed.length} alunos e vagas associadas.`);
    console.log(`Senha padrão para todos os logins: ${senhaPadrao}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());