const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const Cliente = require('../models/ClienteModel');
const ItemPedido = require('../models/ItemPedidoModel');


const PedidoSchema = new mongoose.Schema({
    numPedido: { type: String, required: true },
    codCli: { type: String, required: true },
    cliente: { type: String, required: false, default: '' },
    dtPedido: { type: Date, required: false, default: '' },
    dtCambio: { type: Date, required: false, default: '' },
    moedCiente: { type: String, required: false, default: '' },
    moedFretInter: { type: String, required: false, default: 1 },
    fretInter: { type: Number, required: false, default: '' },
    moedFretRod: { type: String, required: false, default: '' },
    fretRod: { type: Number, required: false, default: '' },
    txDolar: { type: Number, required: false, default: '' },
    txEuro: { type: Number, required: false, default: '' },
    
    TotFatExp: { type: Number, required: false, default: '' },
    TotFatBRL: { type: Number, required: false, default: '' },
    quantTotal: { type: Number, required: false, default: '' },
    totKgLiq: { type: Number, required: false, default: '' },
    totkgBrut: { type: Number, required: false, default: '' },
    TotProdutExp: { type: Number, required: false, default: '' },
    TotProdutBLR: { type: Number, required: false, default: '' },
    TFreteInterKgExp: { type: Number, required: false, default: '' },
    TFreteInterKgBRL: { type: Number, required: false, default: '' },
    TFreteRodKgExp: { type: Number, required: false, default: '' },
    TFreteRodKgBRL: { type: Number, required: false, default: '' },
    TotFatExp: { type: Number, required: false, default: '' },
    TotFatBRL: { type: Number, required: false, default: '' },
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

        await this.consultCadCliente();

        await this.proxCodTab();

        await this.numPedidoExiste();

        if(this.errors.length > 0) return;

        this.pedido = await PedidoModel.create(this.body);


    }

    //Pendente construir validação com tabela de clientes 
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
        // if(!this.body.numPedido) this.errors.push('Numero do pedido é uma informação obrigatoria')
        if(!this.body.codCli) this.errors.push('Codigo do Cliente é uma informação obrigatoria')
        // if(!this.body.moedCiente) this.errors.push('Moeda do Cliente e uma informação obrigatoria')

    }

    cleanUp() {
        for(const key in this.body){
            if(typeof this.body[key] !== 'string' && typeof this.body[key] !== 'number' && typeof this.body[key] !== 'Date') {
                this.body[key] = '';
            }
        }

        this.body = {
            // numPedido: this.body.numPedido,
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

        await this.consultCadCliente();

        // this.validaPedido();

        await this.CalcPedido(id);

        if(this.errors.length > 0) return;
         
        this.pedido = await PedidoModel.findByIdAndUpdate(id, this.body, { new: true});
    
    }  



    //Busca o utimo elemento incluido na coleção realiza tratamento e fornece o proximo codCli
    async proxCodTab(){
        this.pedido = await PedidoModel.find({}).sort({"_id":-1}).limit(1);
        var proxCod = String

        this.pedido.forEach(cont =>{proxCod = cont.numPedido});

        if (proxCod) {
            this.body.numPedido = (parseInt(proxCod) + 1).toString().padStart(6, '0');
        } else {
            this.body.numPedido = "000001";
        }

        // console.log(this.body.numPedido);

    }

    async consultCadCliente(){
        const codCli = String(this.body.codCli).substr(0, 6);  
        const CadClient = await Cliente.buscaPorCodCli( codCli );
        
        CadClient.forEach(cont =>{
            this.body.codCli = cont.codCli;
            this.body.cliente = cont.nome;
            this.body.moedCiente = cont.moedaCli;
        });

    }


    async CalcPedido(id) {

        if(typeof id !== 'string') return;

        console.log(id);
        this.pedido = await PedidoModel.find({_id: id});
        console.log(this.pedido);

        const itemsPedido = await ItemPedido.buscaItemPedidos(id);
    
        let	Paridade = 0;
        let	mDolar = 0;
        let	mCliente = 0;
            
        let	TotProdutBLR = 0;
        let	TotProdutExp = 0;
    
        let	quantLin = 0;
        let	pesoliqLin = 0;
        let	pesobrutLin = 0;
    
        let	quantTotal = 0;
        let	totKgLiq = 0;
        let	totkgBrut = 0;
    
        let	FreteInterKg = 0;
        let	TFreteInterKgBRL = 0;
        let	TFreteInterKgExp = 0;
    
        let	FreteRodKg = 0;
        let	TFreteRodKgBRL = 0;
        let	TFreteRodKgExp = 0;
    
        let	TotFatExp = 0;
        let	TotFatBRL = 0;
    
    
        // Percorre itens do pedido e totaliza quantidade de quilos
        itemsPedido.forEach(cont =>{
    
            quantLin = cont.prodQuant;
            pesoliqLin = cont.prodPesoLiq;
            pesobrutLin = cont.prodPesoBrut;
            
            quantTotal += quantLin;
            totKgLiq += pesoliqLin;
            totkgBrut += pesobrutLin;
    
            TotProdutExp += cont.prodVlTot;
        });
    
        // console.log(protudo);
        this.pedido.forEach(contPed =>{
            
            mDolar = contPed.txDolar;
            mCliente = contPed.txEuro; //Cambio moeda Cliente pode ser Euro ou outra não confundir com nome do campo.
            Paridade = (mCliente/mDolar);
    
    
            //Tratamento para pedido em Dolar
            if (contPed.moedCiente == "Dolar"){
    
                //tratamento para frete internacional em dolar ou Euro
                if (contPed.moedFretInter == "Dolar") {
                    FreteInterKg = contPed.fretInter;                
                } else {
                    FreteInterKg = (contPed.fretInter/Paridade);                
                }
    
                //totalizando frete internacional na moeda do cliente 
                TFreteInterKgExp = (FreteInterKg * totkgBrut);
                TFreteInterKgBRL = (TFreteInterKgExp * mDolar);
    
            
                //tratamento para frete internacional em dolar ou Euro
                if (contPed.moedFretRod == "Dolar") {
                    FreteRodKg = contPed.fretRod;                
                } else {
                    FreteRodKg = (contPed.fretRod/Paridade);                
                }
    
                //totalizando frete rodoviario na moeda do cliente 
                TFreteRodKgExp = (FreteRodKg * totkgBrut);
                TFreteRodKgBRL = (TFreteRodKgExp * mDolar);
    
                //Totais gerais 
                TotProdutBLR = (TotProdutExp * mDolar);
                
                TotFatExp = (TotProdutExp + TFreteInterKgExp + TFreteRodKgExp);
                TotFatBRL = (TotFatExp * mDolar);
            
    
            }
            
            // Tratamento para Pedido em uma moeda difetente de Dolar
            else{
    
                //tratamento para frete internacional em dolar ou Euro
                if (contPed.moedFretInter == "Dolar") {
                    FreteInterKg = (contPed.fretInter/Paridade);     
                } else {
                    FreteInterKg = contPed.fretInter;                
                }
    
                //totalizando frete internacional na moeda do cliente 
                TFreteInterKgExp = (FreteInterKg * totkgBrut);
                TFreteInterKgBRL = (TFreteInterKgExp * mCliente);
    
            
                //tratamento para frete internacional em dolar ou Euro
                if (contPed.moedFretRod == "Dolar") {
                    FreteRodKg = (contPed.fretRod/Paridade);     
                } else {
                    FreteRodKg = contPed.fretRod;                           
                }
    
                //totalizando frete rodoviario na moeda do cliente 
                TFreteRodKgExp = (FreteRodKg * totkgBrut);
                TFreteRodKgBRL = (TFreteRodKgExp * mCliente);
    
                //Totais gerais 
                TotProdutBLR = (TotProdutExp * mCliente)
                
                TotFatExp = (TotProdutExp + TFreteInterKgExp + TFreteRodKgExp);
                TotFatBRL = (TotFatExp * mCliente)
    
            }
    
            
        });
    
        if(this.errors.length > 0) return;

        this.body.quantTotal = quantTotal;
        this.body.totKgLiq = totKgLiq;
        this.body.totkgBrut = totkgBrut;
        this.body.TotProdutExp = TotProdutExp;
        this.body.TotProdutBLR = TotProdutBLR;
        this.body.TFreteInterKgExp = TFreteInterKgExp;
        this.body.TFreteInterKgBRL = TFreteInterKgBRL;
        this.body.TFreteRodKgExp = TFreteRodKgExp;
        this.body.TFreteRodKgBRL = TFreteRodKgBRL;
        this.body.TotFatExp = TotFatExp;
        this.body.TotFatBRL = TotFatBRL;

        console.log(this.pedido); 
        console.log(this.body); 
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



