const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { updateProductValidation, handleValidation } = require('../middleware/validate');
const productController = require('../controllers/productController');

// GET /api/products - list products (supports optional query params)
router.get('/', productController.getProducts);

// GET /api/products/export - export CSV
router.get('/export', productController.exportProducts);

// POST /api/products - create new product
router.post('/', productController.createProduct);

// POST /api/products/import - import CSV (multipart form-data with field 'csvFile')
router.post('/import', upload.single('csvFile'), productController.importProducts);

// GET /api/products/:id/history - get inventory history for a product
router.get('/:id/history', productController.getProductHistory);

// PUT /api/products/:id - update product
router.put('/:id', updateProductValidation, handleValidation, productController.updateProduct);

// DELETE /api/products/:id - delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
