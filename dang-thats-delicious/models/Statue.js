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
  }
});

statueSchema.pre('save', function(next) {
  if(!this.isModified('title')) {
    next();
    return;
  }
  this.slug = slug(this.title);
  next();
  // MAKE SLUGS UNIQUE
});

module.exports = mongoose.model('Statue', statueSchema);
