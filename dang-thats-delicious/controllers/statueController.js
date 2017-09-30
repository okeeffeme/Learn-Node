const mongoose = require('mongoose');
const Statue = mongoose.model('Statue');

exports.homepage = (req, res) => {
  res.render('index');
};

exports.addStatue = (req, res) => {
  res.render('editStatue', {title: 'Add Statue'});
};

exports.createStatue = async (req, res) => {
  const statue = new Statue(req.body);
  await statue.save();
  console.log('It worked!');
  res.redirect('/');
};
