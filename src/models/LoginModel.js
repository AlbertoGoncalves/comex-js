const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
        this.idUser = null;
    }


    async register() {
        this.valida();
        
        if(this.errors.length > 0) return;

        await this.userExiste();
        
        await this.idUserExiste();

        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);


    }

    async userExiste() {
        this.user = await LoginModel.findOne({ email: this.body.email});
        if(this.user) this.errors.push('E-mail já existe');
    }

    async idUserExiste() {
        this.idUser = await LoginModel.findOne({ idUser: this.body.idUser});
        if(this.idUser) this.errors.push('Usuário já existe');
    }

    valida() {

        //Validar se nome tem mais de 3 caracteres
        if(this.body.idUser.length < 3 ) {
            this.errors.push('O Usuario precisa ter mais de 3 caracteres');
        }

        //Validar se a senha de confirmação é igual a senha
        if(this.body.password !== this.body.password2) {
            this.errors.push('As senhas digitadas são diferentes');
        }

        this.cleanUp(); //Verifica se é String

        //Validacao    
        //Validando o email 
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail invalido');

        //Validando tamanho da senha de 3 a 50 caracteres 
        if(this.body.password.length < 3 || this.body.password.length > 50 ) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }
        
    }


    async login() {
        this.validaLogin();

        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email});
        
        if(!this.user) {
            this.errors.push('Usuário não existe.');
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha invaldia.');
            this.user = null;
            return;
        }

    }


    validaLogin() {

        this.cleanUp(); //Verifica se é String

        //Validacao    
        //Validando o email 
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail invalido');

        //Validando tamanho da senha de 3 a 50 caracteres 
        if(this.body.password.length < 3 || this.body.password.length > 50 ) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }
        
    }

    cleanUp() {
        for(const key in this.body){
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            idUser: this.body.idUser,
            email: this.body.email,
            password: this.body.password,
            
        };

    }
}

module.exports = Login;
