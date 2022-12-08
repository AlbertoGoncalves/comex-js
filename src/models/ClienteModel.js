const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const ClienteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    pais: { type: String, required: false, default: '' },
    moedaCli: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ClienteModel = mongoose.model('Cliente', ClienteSchema);

class Cliente {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.cliente = null;
    }

    async register() {
        this.validaCliente();
        
        if(this.errors.length > 0) return;

        await this.emailExiste();

        await this.telefoneExiste();
        
        await this.nomeExiste();

        if(this.errors.length > 0) return;

        this.cliente = await ClienteModel.create(this.body);


    }

    async emailExiste() {
        if(this.body.email) { 
            this.cliente = await ClienteModel.findOne({ email: this.body.email});
            if(this.cliente) this.errors.push('E-mail já existe');
        }
    }

    async telefoneExiste() {
        if(this.body.telefone) { 
            this.cliente = await ClienteModel.findOne({ telefone: this.body.telefone});
            if(this.cliente) this.errors.push('Telefone já existe');
        }
    }

    async nomeExiste() {
        if(this.body.nome) { 
            this.cliente = await ClienteModel.findOne({ nome: this.body.nome});
            if(this.cliente) this.errors.push('Cliente já existe');
        }
    }

    validaCliente() {

        this.cleanUp(); //Verifica se é String

        //Validacao    
        //Validando o email 
        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail invalido');
        if(!this.body.nome) this.errors.push('Nome é uma informação obrigatoria')
        if(!this.body.email && !this.body.telefone ) {
            this.errors.push('Favor informar ao menos um Telefone ou E-mail para realizar cadastro');
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
            pais: this.body.pais,
            moedaCli: this.body.moedaCli,
            email: this.body.email,
            telefone: this.body.telefone,
        };

    }

    async edit(id) {
        if(typeof id !== 'string') return;

        this.validaCliente();
        
        if(this.errors.length > 0) return;
         
        this.cliente = await ClienteModel.findByIdAndUpdate(id, this.body, { new: true});
    
    }

    dataCriado() {
        var data = this.criadoEm.toLocaleString().substr(0, 10)
        return data;
    }   


}



//Metodos Estaticos Não tem acesso ao THIS
Cliente.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const cliente = ClienteModel.findById(id);
    return cliente;
};

// pendente realizar tratamento para trazer clientes apenas do usuario logado 
Cliente.buscaClientes = async function() {
    const cliente = await ClienteModel.find()
     .sort({criadoEm: -1}); //-1 ordem decrescente 1 ordem crescente
    return cliente;
};

Cliente.delete = async function(id) {
    if(typeof id !== 'string') return;
    const cliente = await ClienteModel.findOneAndDelete({_id: id});
    return cliente;
};
module.exports = Cliente;
