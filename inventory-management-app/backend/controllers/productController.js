const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../db');

// Helper to run SQL as promise
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

exports.getProducts = async (req, res) => {
  try {
    const { category, name, page = 1, limit = 1000, sort = 'id', order = 'ASC' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let where = [];
    const params = [];
    if (category) {
      where.push('category = ?');
      params.push(category);
    }
    if (name) {
      where.push('name LIKE ?');
      params.push(`%${name}%`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `SELECT * FROM products ${whereClause} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
    params.push(Number(limit), offset);

    const rows = await allAsync(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, category, brand, stock, status, image } = req.body;

    // Check uniqueness of name if provided
    if (name) {
      const existing = await getAsync('SELECT id FROM products WHERE name = ? AND id != ?', [name, id]);
      if (existing) {
        return res.status(400).json({ error: 'Product name already exists for another product' });
      }
    }

    const product = await getAsync('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const oldStock = product.stock;
    const newStock = typeof stock !== 'undefined' ? Number(stock) : oldStock;

    await runAsync(
      `UPDATE products SET name = COALESCE(?, name), unit = COALESCE(?, unit), category = COALESCE(?, category), brand = COALESCE(?, brand), stock = COALESCE(?, stock), status = COALESCE(?, status), image = COALESCE(?, image) WHERE id = ?`,
      [name, unit, category, brand, newStock, status, image, id]
    );

    if (oldStock !== newStock) {
      await runAsync(
        'INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date) VALUES (?, ?, ?, ?)',
        [id, oldStock, newStock, new Date().toISOString()]
      );
    }

    const updated = await getAsync('SELECT * FROM products WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.importProducts = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file is required as csvFile' });

  const filePath = req.file.path;
  const added = [];
  const skipped = [];

  const stream = fs.createReadStream(filePath).pipe(csv());

  stream.on('data', async (row) => {
    // Expecting CSV headers like: name,unit,category,brand,stock,status,image
    stream.pause();
    try {
      const name = (row.name || '').trim();
      if (!name) {
        skipped.push({ row, reason: 'Missing name' });
      } else {
        const exists = await getAsync('SELECT id FROM products WHERE name = ?', [name]);
        if (exists) {
          skipped.push({ row, reason: 'Duplicate name' });
        } else {
          const stmt = `INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          const stock = row.stock ? Number(row.stock) : 0;
          await runAsync(stmt, [name, row.unit || null, row.category || null, row.brand || null, stock, row.status || null, row.image || null]);
          added.push(name);
        }
      }
    } catch (err) {
      console.error('Error processing row', err);
      skipped.push({ row, reason: 'Error' });
    } finally {
      stream.resume();
    }
  });

  stream.on('end', () => {
    // Optionally remove the uploaded file
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    res.json({ addedCount: added.length, skippedCount: skipped.length, added, skipped });
  });

  stream.on('error', (err) => {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse CSV' });
  });
};

exports.exportProducts = async (req, res) => {
  try {
    const rows = await allAsync('SELECT * FROM products', []);

    const headers = ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
    const lines = [headers.join(',')];

    rows.forEach((r) => {
      const vals = headers.map((h) => {
        const v = r[h];
        if (v === null || typeof v === 'undefined') return '';
        // Escape quotes and commas
        return `"${String(v).replace(/"/g, '""')}"`;
      });
      lines.push(vals.join(','));
    });

    const csvData = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csvData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};

exports.getProductHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await allAsync('SELECT * FROM inventory_history WHERE product_id = ? ORDER BY change_date DESC', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, unit, category, brand, stock, status, image } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    // Check uniqueness
    const existing = await getAsync('SELECT id FROM products WHERE name = ?', [name]);
    if (existing) {
      return res.status(400).json({ error: 'Product name already exists' });
    }

    const result = await runAsync(
      'INSERT INTO products (name, unit, category, brand, stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, unit || null, category || null, brand || null, stock || 0, status || null, image || null]
    );

    const newProduct = await getAsync('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await getAsync('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated history records first
    await runAsync('DELETE FROM inventory_history WHERE product_id = ?', [id]);
    
    // Delete the product
    await runAsync('DELETE FROM products WHERE id = ?', [id]);
    
    res.json({ message: 'Product deleted successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
