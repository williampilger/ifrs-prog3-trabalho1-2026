import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

const md5 = (s: string) => createHash('md5').update(s).digest('hex')

async function main() {
  const areas = await Promise.all([
    prisma.area.upsert({ where: { nome: 'Técnico de Informática' }, update: {}, create: { nome: 'Técnico de Informática' } }),
    prisma.area.upsert({ where: { nome: 'Eletrotécnico' }, update: {}, create: { nome: 'Eletrotécnico' } }),
    prisma.area.upsert({ where: { nome: 'Montador de Móveis' }, update: {}, create: { nome: 'Montador de Móveis' } }),
    prisma.area.upsert({ where: { nome: 'Desenvolvedor FullStack' }, update: {}, create: { nome: 'Desenvolvedor FullStack' } }),
  ])

  const senha = md5('Teste53!')

  const usuarios = await Promise.all([
    prisma.usuario.upsert({ where: { email: 'aluno1@localhost.com.br' }, update: {}, create: { nome: 'Aluno Primeiro', email: 'aluno1@localhost.com.br', pswd: senha, tipo: 'aluno' } }),
    prisma.usuario.upsert({ where: { email: 'aluno2@localhost.com.br' }, update: {}, create: { nome: 'Aluno Segundo', email: 'aluno2@localhost.com.br', pswd: senha, tipo: 'aluno' } }),
    prisma.usuario.upsert({ where: { email: 'empresa1@localhost.com.br' }, update: {}, create: { nome: 'Empresa Primeira', email: 'empresa1@localhost.com.br', pswd: senha, tipo: 'empresa' } }),
    prisma.usuario.upsert({ where: { email: 'empresa2@localhost.com.br' }, update: {}, create: { nome: 'Empresa Segunda', email: 'empresa2@localhost.com.br', pswd: senha, tipo: 'empresa' } }),
  ])

  const [, , empresa1, empresa2] = usuarios
  const [tiInformatica] = areas

  await Promise.all([
    prisma.vaga.upsert({
      where: { id: 1 },
      update: {},
      create: {
        titulo: 'Estágio em TI',
        descricao: 'Manutenção de computadores',
        areaId: tiInformatica.id,
        empresaId: empresa1.id,
        local: 'Bom Princípio',
        contatoNome: 'Pessoa A',
        contatoTelefone: '5551999999999',
        contatoEmail: 'rh@empresa1.com.br',
        turno: 'integral',
        modalidade: 'presencial',
      },
    }),
    prisma.vaga.upsert({
      where: { id: 2 },
      update: {},
      create: {
        titulo: 'Trabalho B',
        descricao: 'Manutenção de computadores',
        areaId: tiInformatica.id,
        empresaId: empresa2.id,
        local: 'Feliz',
        contatoNome: 'Pessoa B',
        contatoTelefone: '5551999999999',
        contatoEmail: 'rh@empresa1.com.br',
        turno: 'integral',
        modalidade: 'presencial',
      },
    }),
  ])

  console.log('Seed concluído.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
