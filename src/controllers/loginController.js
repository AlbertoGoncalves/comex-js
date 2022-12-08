const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');
    res.render('login');
  };

  exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/login/index');
  };

exports.register = async function(req, res) {
  try {
    const login = new Login(req.body);
    await login.register();
    // res.send(req.body);
    // res.send(login.errors);
  
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function() {
        return res.redirect('/login/index');
      });
      return;
    }

    req.flash('success', 'Usuário criado com sucesso.');
      req.session.save(function() {
        return res.redirect('/login/index');
      });

  } catch(e) {
    console.log(e);
    return res.render('404');
  }
  
};

exports.login = async function(req, res) {
  
  try {
    const login = new Login(req.body);
    await login.login();
  
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function() {
        return res.redirect('/login/index');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;
    req.session.save(function() {
      return res.redirect('/login/index');
    });

  } catch(e) {
    console.log(e);
    return res.render('404');
  }


};