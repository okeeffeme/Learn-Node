const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const statueSchema = new mongoose.Schema({
  name: {
      type: String,
      trim: true,
      required: 'Please add a name'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String]
});

statueSchema.pre('save', function(next) {
  if(!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  next();
  // MAKE SLUGS ARE UNIQUE
});

module.exports = mongoose.model('Statue', statueSchema);
