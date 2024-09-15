const express = require('express');
const router = express.Router();

const { create } = require('../controllers/ProductController');

router.post('/products', create);
module.exports = router;