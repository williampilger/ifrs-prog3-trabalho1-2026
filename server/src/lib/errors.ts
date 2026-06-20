
export class GenericError extends Error {

    private code:string='unknown';
    public description: string='';

    constructor(message:string, code?:string) {
        super(message);
        if(code) this.code = code;
        this.name = 'Generic GenericError';

        console.log('240528095755 - Trow Error: ' + JSON.stringify(this) );
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            name: this.name,
            description: this.description
        }
    }

    static report(e:any, code?:string){
        //##VER## - Implementar a função de reportar via LOG
        console.log(`${code ?? 'GENERIC'} - ${ (typeof e === 'string') ? e : JSON.stringify(e) }`)        
    }
}

export class InputError extends GenericError {

    constructor(message:string, code?:string) {
        super(message,code);
        this.name = 'Input Error';
        this.description = 'Uma inconsistência nos dados informados impediu o cálculo. Normalmente acontece se algum dado necessário não foi informado.'
    }
}

export class InconsistencyError extends GenericError {

    constructor(message:string, code?:string) {
        super(message,code);
        this.name = 'Inconsistency Error';
        this.description = 'Uma inconsistência interna impediu o software de continuar. Isso normalmente acontece por falhas nas regras de negociação.'
    }
}

export class NumericError extends GenericError {

    constructor(message:string, code?:string) {
        super(message,code);
        this.name = 'Numeric Error';
        this.description = 'Uma inconsistência numérica impediu o cálculo';
    }
}