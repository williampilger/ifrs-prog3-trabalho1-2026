export type UsuarioTipo = 'aluno' | 'empresa';

export type Usuario = {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
    tipo: UsuarioTipo;
    nascimento?: string;
    curso?: string;
    cnpj?: string;
};

export type DadosCadastro = {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    tipo: UsuarioTipo;
    nascimento?: string;
    curso?: string;
    cnpj?: string;
};

export type DadosVagaAPI = {
    titulo: string;
    curso: string;
    turno: string;
    modalidade: string;
    salario: number | null;
    local?: string;
    descricaoAtividades: string;
    descricaoHabilidades?: string;
    beneficios: string[];
    contatoNome?: string;
    contatoTelefone?: string;
    contatoEmail?: string;
};

export type Beneficio = {
    id: number;
    nome: string;
};

export type Empresa = {
    //todo FALTA FAZER
}:

export type Vaga = {
    id: number;
    titulo: string;
    descricao: string;
    area: { nome: string };// isso ainda é meio temporário
    empresa: Empresa;
    local: string | null;
    modalidade: string;
    turno: string;
    salario: number | null;
    beneficios: Beneficio[];
    contatoNome: string | null;
    contatoEmail: string | null;
    contatoTelefone: string | null;
};