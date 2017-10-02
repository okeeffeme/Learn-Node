const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const statueSchema = new mongoose.Schema({
  title: {
      type: String,
      trim: true,
      required: 'Please add a name'
  },
  artist: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates'
    }],
    address: {
      type: String
    }
  },
  photo: String
});

statueSchema.index({
  title: 'text',
  artist: 'text'
});

statueSchema.pre('save', async function(next) {
  if(!this.isModified('title')) {
    next();
    return;
  }
  this.slug = slug(this.title);
  //find duplicates and make slugs unique
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const statuesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if(statuesWithSlug.length) {
    this.slug = `${this.slug}-${statuesWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Statue', statueSchema);
