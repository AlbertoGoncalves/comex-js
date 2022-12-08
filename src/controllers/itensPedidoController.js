const { async } = require('regenerator-runtime');
const Produto = require('../models/ProdutoModel');

exports.index = async (req, res) => {
  const produto = await Produto.buscaProdutos();
  res.render('indexProduto', { produto });
};

exports.cadastro = (req, res) => {
  res.render('cadProduto', {produto:{}});  
};


exports.register = async function(req, res) {
    try {
      const produto = new Produto(req.body);
      await produto.register();
      
      if (produto.errors.length > 0) {
        req.flash('errors', produto.errors);
        req.session.save(function() {
          return res.redirect('/produto/cadastro');
        });
        return;
      }
  
      req.flash('success', 'Produto criado com sucesso.');
      req.session.save(() => res.redirect('/produto/index'));
      return;
  
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
    
}; 



exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const produto = await Produto.buscaPorId(req.params.id);
  
  if(!produto) return res.render('404');
  
  res.render('cadProduto', {produto});
};  



exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');

    const produto = new Produto(req.body);
    
    await produto.edit(req.params.id);
  
    if (produto.errors.length > 0) {
      req.flash('errors', produto.errors);
      req.session.save(function() {
        return res.redirect('/produto/index');
      });
      return;
    }

    req.flash('success', 'Produto alterado com sucesso.');
    req.session.save(function() {
      return res.redirect('/produto/index');
    });
    return;  
  
  } catch(e) {
    console.log(e);
    return res.render('404');
  }

}; 

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');
  const produto = await Produto.delete(req.params.id);
  if(!produto) return res.render('404');

  req.flash('success', 'Produto Excluido com sucesso.');
  req.session.save(() => res.redirect('/produto/index'));
  return;   
};  