const Product = require('../models/Product');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;
  
      if (!name || !description || !price || !stock) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newProduct = new Product({
        name,
        description,
        price,
        stock,
      });
  
      await newProduct.save();
  
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };