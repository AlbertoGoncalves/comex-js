import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/Login'; 
const login = new Login('.from-login');
const cadastro = new Login('.from-cadastro');

// console.log('Olá mundo 3');

login.init();
cadastro.init();



