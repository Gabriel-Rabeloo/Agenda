const Contato = require('../models/ContatoModel');

exports.index = async(req, res) => {
  const contatos = await Contato.searchContacts();
  res.render('index', { contatos });
};
