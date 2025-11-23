require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./db');

const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images/files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Inventory Management Backend' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
