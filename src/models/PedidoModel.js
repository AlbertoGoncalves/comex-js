const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');

const PedidoSchema = new mongoose.Schema({
    numPedido: { type: String, required: true },
    codCli: { type: String, required: true },
    cliente: { type: String, required: false, default: '' },
    dtPedido: { type: Date, required: false, default: '' },
    dtCambio: { type: Date, required: false, default: '' },
    moedCiente: { type: String, required: true, default: '' },
    moedFretInter: { type: Number, required: false, default: 1 },
    fretInter: { type: Number, required: false, default: '' },
    moedFretRod: { type: Number, required: false, default: '' },
    fretRod: { type: Number, required: false, default: '' },
    txDolar: { type: Number, required: false, default: '' },
    txEuro: { type: Number, required: false, default: '' },
    vlTotalMoedaCli: { type: Number, required: false, default: '' },
    vlTotalMoedaCli: { type: Number, required: false, default: '' },
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

        // await this.codCliExiste();
        
        await this.numPedidoExiste();

        if(this.errors.length > 0) return;

        this.pedido = await PedidoModel.create(this.body);


    }

    async codCliExiste() {
        if(this.body.cod) { 
            this.pedido = await PedidoModel.findOne({ cod: this.body.cod});
            if(this.pedido) this.errors.push('Codigo do Cliente não cadastrado');
        }
    }

    async numPedidoExiste() {
        if(this.body.nome) { 
            this.pedido = await PedidoModel.findOne({ numPedido: this.body.numPedido});
            if(this.pedido) this.errors.push('Numero do pedido já existe');
        }
    }

    validaPedido() {

        this.cleanUp(); //Verifica se é String

        //Validacao    
        if(!this.body.numPedido) this.errors.push('Numero do pedido é uma informação obrigatoria')
        if(!this.body.codCli) this.errors.push('Codigo do Cliente é uma informação obrigatoria')
        if(!this.body.moedCiente) this.errors.push('Moeda do Cliente e uma informação obrigatoria')

    }

    cleanUp() {
        for(const key in this.body){
            if(typeof this.body[key] !== 'string' && typeof this.body[key] !== 'number' && typeof this.body[key] !== 'Date') {
                this.body[key] = '';
            }
        }

        this.body = {
            numPedido: this.body.numPedido,
            codCli: this.body.codCli,
            cliente: this.body.cliente,
            dtPedido: this.body.dtPedido,
            dtCambio: this.body.dtCambio,
            moedCiente: this.body.moedCiente,
            moedFretInter: this.body.moedFretInter,
            fretInter: this.body.fretInter, 
            moedFretRod: this.body.moedFretRod,
            fretRod: this.body.fretRod,
            txDolar: this.body.txDolar,
            txEuro: this.body.txEuro,
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
