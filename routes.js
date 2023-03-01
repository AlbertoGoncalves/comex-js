const express = require('express');
const route = express.Router();

const { loginRequired } = require('./src/middlewares/middleware');


const homeController = require('./src/controllers/homeController');
// Rotas da home
route.get('/', homeController.index);


const loginController = require('./src/controllers/loginController');
//Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);


const contatoController = require('./src/controllers/contatoController');
//Rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);


const clienteController = require('./src/controllers/clienteController');
// Rotas de clientes
route.get ('/cliente/index', loginRequired, clienteController.index);
route.get ('/cliente/cadastro', loginRequired, clienteController.cadastro);
route.post('/cliente/register', loginRequired, clienteController.register);
route.get ('/cliente/cadastro/:id', loginRequired, clienteController.editIndex);
route.post('/cliente/edit/:id', loginRequired, clienteController.edit);
route.get ('/cliente/delete/:id', loginRequired, clienteController.delete);


const produtoController = require('./src/controllers/produtoController');
// Rotas de clientes
route.get ('/produto/index', loginRequired, produtoController.index);
route.get ('/produto/cadastro', loginRequired, produtoController.cadastro);
route.post('/produto/register', loginRequired, produtoController.register);
route.get ('/produto/cadastro/:id', loginRequired, produtoController.editIndex);
route.post('/produto/edit/:id', loginRequired, produtoController.edit);
route.get ('/produto/delete/:id', loginRequired, produtoController.delete);


const pedidoController = require('./src/controllers/pedidoController');
// Rotas de Pedido
route.get ('/pedido/index', loginRequired, pedidoController.index);
route.get ('/pedido/cadastro', loginRequired, pedidoController.cadastro);
route.post('/pedido/register', loginRequired, pedidoController.register);
route.get ('/pedido/cadastro/:id', loginRequired, pedidoController.editIndex);
route.post('/pedido/edit/:id', loginRequired, pedidoController.edit);
route.get ('/pedido/delete/:id', loginRequired, pedidoController.delete);

const itemPedidoController = require('./src/controllers/itemPedidoController');
// Rotas de Item Pedido
route.post('/itemPedido/register/:id', loginRequired, itemPedidoController.register);
route.get ('/itemPedido/cadastro/:id', loginRequired, itemPedidoController.editIndex);
route.post('/itemPedido/edit/:id', loginRequired, itemPedidoController.edit);
route.get ('/itemPedido/delete/:id', loginRequired, itemPedidoController.delete);


module.exports = route;
