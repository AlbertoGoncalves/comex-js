const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');

const ProdutoSchema = new mongoose.Schema({
    cod: { type: String, required: true },
    nome: { type: String, required: true },
    marca: { type: String, required: false, default: '' },
    tipo: { type: String, required: false, default: '' },
    unid: { type: String, required: false, default: '' },
    fatConv: { type: Number, required: false, default: 1 },
    pesoLiq: { type: Number, required: true, default: '' },
    pesoBrut: { type: Number, required: false, default: '' },

});

const ProdutoModel = mongoose.model('Produto', ProdutoSchema);

class Produto {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.produto = null;
    }

    async register() {
        this.validaProduto();
        
        if(this.errors.length > 0) return;

        await this.codExiste();
        
        await this.nomeExiste();

        if(this.errors.length > 0) return;

        this.produto = await ProdutoModel.create(this.body);


    }

    async codExiste() {
        if(this.body.cod) { 
            this.produto = await ProdutoModel.findOne({ cod: this.body.cod});
            if(this.produto) this.errors.push('Codigo do produto já existe');
        }
    }

    async nomeExiste() {
        if(this.body.nome) { 
            this.produto = await ProdutoModel.findOne({ nome: this.body.nome});
            if(this.produto) this.errors.push('Nome do produto já existe');
        }
    }

    validaProduto() {

        this.cleanUp(); //Verifica se é String

        //Validacao    
        if(!this.body.cod) this.errors.push('Codigo do produto é uma informação obrigatoria')
        if(!this.body.nome) this.errors.push('Nome do produto é uma informação obrigatoria')
        if(!this.body.pesoLiq) this.errors.push('Peso liquido do produto é uma informação obrigatoria')

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

        this.validaProduto();
        
        if(this.errors.length > 0) return;
         
        this.produto = await ProdutoModel.findByIdAndUpdate(id, this.body, { new: true});
    
    }  

}



//Metodos Estaticos Não tem acesso ao THIS
Produto.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    const produto = ProdutoModel.findById(id);
    return produto;
};

// pendente realizar tratamento para trazer produto apenas do usuario logado 
Produto.buscaProdutos = async function() {
    const produto = await ProdutoModel.find()
     .sort({criadoEm: -1}); //-1 ordem decrescente 1 ordem crescente
    return produto;
};

Produto.delete = async function(id) {
    if(typeof id !== 'string') return;
    const produto = await ProdutoModel.findOneAndDelete({_id: id});
    return produto;
};
module.exports = Produto;
