export type UsuarioTipo = 'aluno' | 'empresa';

export type Usuario = {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
    tipo: UsuarioTipo;

    //optionais (depende do tipo)
    nascimento?: string; // para alunos
    curso?: string; // para alunos
    cnpj?: string; // para empresas
};

export type Aluno = Usuario & {
    tipo: 'aluno',
    nascimento: string;
    curso: string;
    
};
export type Empresa = Usuario & {
    tipo: 'empresa'
    cnpj: string;

};

export type Beneficio = {
    id: number;
    nome: string;
};

export type Turno = 'integral' | 'manha' | 'tarde' | 'noite';
export type Modalidade = 'presencial' | 'remoto' | 'hibrido';

export type Area = { 
    id: number,
    nome: string
}

export type Vaga = {
    id: number;
    titulo: string;
    descricao: string;
    areaId: number;
    area: Area;
    empresaId: number;
    empresa: Empresa;
    local: string | null;
    modalidade: Modalidade;
    turno: Turno;
    salario: number | null;
    preenchida: boolean;
    beneficios: Beneficio[];
    contatoNome: string | null;
    contatoEmail: string | null;
    contatoTelefone: string | null;
    criadoEm: string;
    excluidoEm: string | null;
};
