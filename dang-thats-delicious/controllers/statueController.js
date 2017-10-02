const mongoose = require('mongoose');
const Statue = mongoose.model('Statue');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

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

exports.resize = async (req, res, next) => {
  //check if new img to resize
  if(!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  //resize and write to filesystem
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  //next
  next();
};

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

exports.getStatueBySlug = async (req, res, next) => {
  const statue = await Statue.findOne({ slug: req.params.slug });
  if(!statue) {
    next();
    return;
  }
  res.render('statuePage', { title: `${statue.title}`, statue });
};

exports.editStatue = async (req, res) => {
  //Find store via ID
  const statue = await Statue.findOne({ _id: req.params.id });
  //confirm admin acct
  //render edit form
  res.render('editStatue', { title: `Edit ${statue.title}`, statue });
};

exports.searchStatues = async (req, res) => {
  const statue = await Statue.find(
  // first find statue that match
  {
    $text: {
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' }
  })
  // the sort them
  .sort({
    score: { $meta: 'textScore' }
  })
  // limit to only 5 results
  .limit(5);
  res.json(statue);
};
