const mongoose = require('mongoose');
const Statue = mongoose.model('Statue');
const multer = mongoose.model('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype is not allowed'}, false);
    }
  }
};

exports.upload = multer(multerOptions).single('photo');

exports.homepage = (req, res) => {
  res.render('index');
};

exports.addStatue = (req, res) => {
  res.render('editStatue', {title: 'Add Statue'});
};

exports.createStatue = async (req, res) => {
  const statue = new Statue(req.body);
  //if ever allowing auto creation
  //const statue = await (new Statue(req.body)).save();
  await statue.save();
  req.flash('success', `Successfully created <strong>${statue.title}</strong>.`);
  res.redirect('/');
  //if allow auto creation
  //res.redirect(`/store/${statue.slug}`);
};

exports.updateStatue = async (req, res) => {
  //set location data to point
  req.body.location.type = 'Point';
  //find statue and update
  const statue = await Statue.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, //return updated statue
    runValidators: true //check new data against schema
  }).exec(); //exec force run query
  await statue.save();
  //redirect to statue page and notify change
  req.flash('success', `Successfully updated <strong>${statue.title}</strong>. <a href="/statues/${statue._id}">View Statue →</a>`);
  res.redirect(`/statues/${statue._id}/edit`);
};

exports.getStatues = async (req, res) => {
  //Query DB for list of all statues
  const statues = await Statue.find();
  console.log(statues);
  res.render('statues', { title: 'Statues', statues });
};

exports.editStatue = async (req, res) => {
  //Find store via ID
  const statue = await Statue.findOne({ _id: req.params.id });
  //confirm admin acct
  //render edit form
  res.render('editStatue', { title: `Edit ${statue.title}`, statue });
};
