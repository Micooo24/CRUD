const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
      min: 0,
    },
    stock: {
        type: String,
        required: true,
        min: 0,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
  });

  productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

module.exports = mongoose.model('Product', productSchema);



