const { body, validationResult } = require('express-validator');

const updateProductValidation = [
  body('name').optional().isString().trim().notEmpty().withMessage('Name is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be an integer >= 0'),
  body('unit').optional().isString(),
  body('category').optional().isString(),
  body('brand').optional().isString(),
  body('status').optional().isString(),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { updateProductValidation, handleValidation };
