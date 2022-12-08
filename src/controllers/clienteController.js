const { async } = require('regenerator-runtime');
const Cliente = require('../models/ClienteModel');

exports.index = async (req, res) => {
  const cliente = await Cliente.buscaClientes();
  res.render('indexCliente', { cliente });
};

exports.cadastro = (req, res) => {
  res.render('cadCliente', {cliente:{}});  
};


exports.register = async function(req, res) {
    try {
      const cliente = new Cliente(req.body);
      await cliente.register();
      
      if (cliente.errors.length > 0) {
        req.flash('errors', cliente.errors);
        req.session.save(function() {
          return res.redirect('/cliente/cadastro');
        });
        return;
      }
  
      req.flash('success', 'Cliente criado com sucesso.');
      req.session.save(() => res.redirect('/cliente/index'));
      return;
  
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
    
}; 



exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const cliente = await Cliente.buscaPorId(req.params.id);
  
  if(!cliente) return res.render('404');
  
  res.render('cadCliente', {cliente});
};  



exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');

    const cliente = new Cliente(req.body);
    
    await cliente.edit(req.params.id);
  
    if (cliente.errors.length > 0) {
      req.flash('errors', cliente.errors);
      req.session.save(function() {
        return res.redirect('/cliente/index');
      });
      return;
    }

    req.flash('success', 'Cliente alterado com sucesso.');
    req.session.save(function() {
      return res.redirect('/cliente/index');
    });
    return;  
  
  } catch(e) {
    console.log(e);
    return res.render('404');
  }

}; 

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');
  const cliente = await Cliente.delete(req.params.id);
  if(!cliente) return res.render('404');

  req.flash('success', 'Cliente Excluido com sucesso.');
  req.session.save(() => res.redirect('/cliente/index'));
  return;   
};  