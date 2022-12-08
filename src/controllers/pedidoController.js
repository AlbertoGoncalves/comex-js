const { async } = require('regenerator-runtime');
const Pedido = require('../models/PedidoModel');

exports.index = async (req, res) => {
  const pedido = await Pedido.buscaPedidos();
  res.render('pedidoVenda', { pedido });
};

exports.cadastro = (req, res) => {
  res.render('pv', {pedido:{}});  
};


exports.register = async function(req, res) {
    try {
      const pedido = new Pedido(req.body);
      await pedido.register();
      
      if (pedido.errors.length > 0) {
        req.flash('errors', pedido.errors);
        req.session.save(function() {
          return res.redirect('/pedido/cadastro');
        });
        return;
      }
  
      req.flash('success', 'Pedido criado com sucesso.');
      req.session.save(() => res.redirect('/pedido/index'));
      return;
  
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
    
}; 



exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const pedido = await Pedido.buscaPorId(req.params.id);
  
  if(!pedido) return res.render('404');
  
  res.render('cadPedido', {pedido});
};  



exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');

    const pedido = new Pedido(req.body);
    
    await pedido.edit(req.params.id);
  
    if (pedido.errors.length > 0) {
      req.flash('errors', pedido.errors);
      req.session.save(function() {
        return res.redirect('/pedido/index');
      });
      return;
    }

    req.flash('success', 'Pedido alterado com sucesso.');
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
  const pedido = await Pedido.delete(req.params.id);
  if(!pedido) return res.render('404');

  req.flash('success', 'Pedido Excluido com sucesso.');
  req.session.save(() => res.redirect('/pedido/index'));
  return;   
};  