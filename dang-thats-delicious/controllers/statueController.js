exports.homepage = (req, res) => {
  res.render('index');
};

exports.addStatue = (req, res) => {
  res.render('editStatue', {title: 'Add Statue'});
};
