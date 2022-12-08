const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    async register() {
        this.validaContato();
        
        if(this.errors.length > 0) return;

        await this.emailExiste();

        await this.telefoneExiste();

        if(this.errors.length > 0) return;

        this.contato = await ContatoModel.create(this.body);


    }

    async emailExiste() {
        // console.log(`email ${this.body.email}`)
        if(this.body.email) { 
            this.contato = await ContatoModel.findOne({ email: this.body.email});
            if(this.contato) this.errors.push('E-mail já existe');
        }
    }

    async telefoneExiste() {
        // console.log(`telefone ${this.body.telefone}`)
        if(this.body.telefone) { 
            this.contato = await ContatoModel.findOne({ telefone: this.body.telefone});
            if(this.contato) this.errors.push('Telefone já existe');
        }
    }

    validaContato() {

        this.cleanUp(); //Verifica se é String

        //Validacao    
        //Validando o email 
        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail invalido');
        if(!this.body.nome) this.errors.push('Nome é uma informação obrigatoria')
        if(!this.body.email && !this.body.telefone ) {
            this.errors.push('Favor informar ao menos um contato Telefone ou E-mail para realizar cadastro');
        }
    }

    cleanUp() {
        for(const key in this.body){
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        };

    }

    async edit(id) {
        if(typeof id !== 'string') return;

        this.validaContato();
        
        if(this.errors.length > 0) return;
         
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true});
    
    }


}

//Metodos Estaticos Não tem acesso ao THIS
Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const contato = ContatoModel.findById(id);
    return contato;
};

// pendente realizar tratamento para trazer contatos apenas do usuario logado 
Contato.buscaContatos = async function() {
    const contato = await ContatoModel.find()
     .sort({criadoEm: -1}); //-1 ordem decrescente 1 ordem crescente
    return contato;
};

Contato.delete = async function(id) {
    if(typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({_id: id});
    return contato;
};
module.exports = Contato;
