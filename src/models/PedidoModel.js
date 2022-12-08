const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');

const PedidoSchema = new mongoose.Schema({
    cod: { type: String, required: true },
    nome: { type: String, required: true },
    marca: { type: String, required: false, default: '' },
    tipo: { type: String, required: false, default: '' },
    unid: { type: String, required: false, default: '' },
    fatConv: { type: Number, required: false, default: 1 },
    pesoLiq: { type: Number, required: true, default: '' },
    pesoBrut: { type: Number, required: false, default: '' },

});

const PedidoModel = mongoose.model('Pedido', PedidoSchema);

class Pedido {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.pedido = null;
    }

    async register() {
        this.validaPedido();
        
        if(this.errors.length > 0) return;

        await this.codExiste();
        
        await this.nomeExiste();

        if(this.errors.length > 0) return;

        this.pedido = await PedidoModel.create(this.body);


    }

    async codExiste() {
        if(this.body.cod) { 
            this.pedido = await PedidoModel.findOne({ cod: this.body.cod});
            if(this.pedido) this.errors.push('Codigo do pedido já existe');
        }
    }

    async nomeExiste() {
        if(this.body.nome) { 
            this.pedido = await PedidoModel.findOne({ nome: this.body.nome});
            if(this.pedido) this.errors.push('Nome do pedido já existe');
        }
    }

    validaPedido() {

        this.cleanUp(); //Verifica se é String

        //Validacao    
        if(!this.body.cod) this.errors.push('Codigo do pedido é uma informação obrigatoria')
        if(!this.body.nome) this.errors.push('Nome do pedido é uma informação obrigatoria')
        if(!this.body.pesoLiq) this.errors.push('Peso liquido do pedido é uma informação obrigatoria')

    }

    cleanUp() {
        for(const key in this.body){
            if(typeof this.body[key] !== 'string' && typeof this.body[key] !== 'number') {
                this.body[key] = '';
            }
        }

        this.body = {
            cod: this.body.cod, 
            nome: this.body.nome,  
            marca: this.body.marca, 
            tipo: this.body.tipo,  
            unid: this.body.unid, 
            fatConv: this.body.fatConv,
            pesoLiq: this.body.pesoLiq,
            pesoBrut: this.body.pesoBrut,

        };

    }

    async edit(id) {
        if(typeof id !== 'string') return;

        this.validaPedido();
        
        if(this.errors.length > 0) return;
         
        this.pedido = await PedidoModel.findByIdAndUpdate(id, this.body, { new: true});
    
    }  

}



//Metodos Estaticos Não tem acesso ao THIS
Pedido.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const pedido = PedidoModel.findById(id);
    return pedido;
};

// pendente realizar tratamento para trazer pedido apenas do usuario logado 
Pedido.buscaPedidos = async function() {
    const pedido = await PedidoModel.find()
     .sort({criadoEm: -1}); //-1 ordem decrescente 1 ordem crescente
    return pedido;
};

Pedido.delete = async function(id) {
    if(typeof id !== 'string') return;
    const pedido = await PedidoModel.findOneAndDelete({_id: id});
    return pedido;
};
module.exports = Pedido;
