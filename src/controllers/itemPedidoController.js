const { async } = require('regenerator-runtime');
const ItemPedido = require('../models/ItemPedidoModel');

// exports.listItensPedido = async (req, res) => {
//   const itemPedido = await ItemPedido.buscaItemPedidos();
//   res.render('itemPedido', { itemPedido });
// };

exports.register = async function(req, res) {
  try {
    const itemPedido = new ItemPedido(req.body);
    await itemPedido.register();
    
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