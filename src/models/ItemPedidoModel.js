const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const Produto = require('../models/ProdutoModel');
const Pedido = require('./PedidoModel');

const ItemPedidoSchema = new mongoose.Schema({
    idPedido: { type: String, required: false },
    numPedido: { type: String, required: false },
    prodCod: { type: String, required: true },
    prodNome: { type: String, required: false },
    prodUnid: { type: String, required: false, default: '' },
    prodQuant: { type: Number, required: true, default: '' },
    prodPesoLiq: { type: Number, required: false, default: '' },
    prodPesoBrut: { type: Number, required: false, default: '' },
    prodVlUnit: { type: Number, required: true, default: '' },
    prodVlTot: { type: Number, required: false, default: '' },
});

const ItemPedidoModel = mongoose.model('ItemPedido', ItemPedidoSchema);

class ItemPedido {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.itemPedido = null;
    }

    async register() {
        
        this.validaItemPedido();
        
        if(this.errors.length > 0) return;

        // await this.codCliExiste();

        await this.updtCamposProduto();

        if(this.errors.length > 0) return;

        this.itemPedido = await ItemPedidoModel.create(this.body);

        if(this.errors.length > 0) return;

    }

    validaItemPedido() {

        this.cleanUp(); //Verifica se é String

        //Validacao    
        // console.log("pos tratamento cleanUp");
        // console.log(this.body);
        if(!this.body.prodCod) this.errors.push('Codigo do produto é uma informação obrigatoria')
        if(!this.body.prodQuant) this.errors.push('Quantidade é uma informação obrigatoria')
        if(!this.body.prodVlUnit) this.errors.push('Valor unitario é uma informação obrigatoria')

    }

    cleanUp() {
        console.log("cleanUp");
        // console.log(this.body);

        for(const key in this.body){
            if(typeof this.body[key] !== 'string' && typeof this.body[key] !== 'number') {
                this.body[key] = '';
            }
        }

        this.body = {
            idPedido: this.body.idPedido,
            numPedido: this.body.numPedido,
            prodCod: this.body.prodCod, 
            prodNome: this.body.prodNome,  
            prodUnid: this.body.prodUnid, 
            prodQuant: this.body.prodQuant,
            prodPesoLiq: this.body.prodPesoLiq,
            prodPesoBrut: this.body.prodPesoBrut,
            prodVlUnit: this.body.prodVlUnit,
            prodVlTot: this.body.prodVlTot,
        };

    }

    async updtCamposProduto(){
        const codPrd = String(this.body.prodCod).substr(0, 6);  
        const protudo = await Produto.buscaPorProduto( codPrd );
        // console.log(protudo);

        protudo.forEach(cont =>{
            this.body.prodCod = cont.cod;
            this.body.prodNome = cont.nome;
            this.body.prodUnid = cont.unid;
            this.body.prodPesoLiq = cont.pesoLiq * this.body.prodQuant;
            this.body.prodPesoBrut = cont.pesoBrut  * this.body.prodQuant;
        });
        this.body.prodVlTot = this.body.prodQuant * this.body.prodVlUnit;
    }

    async edit(id) {
        if(typeof id !== 'string') return;

        this.validaItemPedido();
        
        if(this.errors.length > 0) return;
         
        this.itemPedido = await ItemPedidoModel.findByIdAndUpdate(id, this.body, { new: true});
    
    }  

}

//Metodos Estaticos Não tem acesso ao THIS
ItemPedido.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const itemPedido = ItemPedidoModel.findById(id);
    return itemPedido;
};

// pendente realizar tratamento para trazer itemPedido apenas do usuario logado 
ItemPedido.buscaItemPedidos = async function(idPedido) {
    const itemPedido = await ItemPedidoModel.find({idPedido: idPedido})
     .sort({criadoEm: -1}); //-1 ordem decrescente 1 ordem crescente
    return itemPedido;
};

ItemPedido.delete = async function(id) {
    if(typeof id !== 'string') return;
    const itemPedido = await ItemPedidoModel.findOneAndDelete({_id: id});
    return itemPedido;
};
module.exports = ItemPedido;
