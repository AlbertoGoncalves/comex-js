const { async } = require('regenerator-runtime');
const ItemPedido = require('../models/ItemPedidoModel');
const Produto = require('../models/ProdutoModel');
const Pedido = require('../models/PedidoModel');

exports.register = async function(req, res) {
  try {
    const itemPedido = new ItemPedido(req.body);
    await itemPedido.register();

    const pedido = new Pedido(req.body);
    await pedido.CalcPedido(req.params.id);
    
    if (itemPedido.errors.length > 0) {
      req.flash('errors', itemPedido.errors);
      req.session.save(function() {
        return res.redirect('/pedido/index');
      });
      return;
    }

    req.flash('success', 'ItemPedido criado com sucesso.');
    req.session.save(() => res.redirect('/pedido/index'));
    return;

  } catch(e) {
    console.log(e);
    return res.render('404');
  }
}; 



exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const itemPedido = await ItemPedido.buscaPorId(req.params.id);
  
  if(!itemPedido) return res.render('404');
  
  res.render('cadPedido', {itemPedido});
};  

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const pedido = await Pedido.buscaPorId(req.params.id);

  // const cliente = await Cliente.buscaPorCodCli(pedido.codCli);
  const produto = await Produto.buscaProdutos();

  const itemPedido = await ItemPedido.buscaItemPedidos(req.params.id);
  
  if(!pedido) return res.render('404');
  
  res.render('cadPedido', { pedido, itemPedido, produto});
}; 



exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');

    const itemPedido = new ItemPedido(req.body);
    
    await itemPedido.edit(req.params.id);
  
    if (itemPedido.errors.length > 0) {
      req.flash('errors', itemPedido.errors);
      req.session.save(function() {
        return res.redirect('/pedido/index');
      });
      return;
    }

    req.flash('success', 'ItemPedido alterado com sucesso.');
    req.session.save(function() {
      return res.redirect('/pedido/index');
    });
    return;  
  
  } catch(e) {
    console.log(e);
    return res.render('404');
  }

}; 

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');
  const itemPedido = await ItemPedido.delete(req.params.id);
  if(!itemPedido) return res.render('404');

  req.flash('success', 'ItemPedido Excluido com sucesso.');
  req.session.save(() => res.redirect('/pedido/index'));
  return;   
};  