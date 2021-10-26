const express = require('express');
const router = express.Router();
const { uploadImageToCloud } = require('../controllers/uploadsController');
const { createProduct, getAllProducts } = require(
  '../controllers/productController');

router.get('/', getAllProducts);
router.post('/', createProduct);
router.post('/uploads', uploadImageToCloud);

module.exports = router;