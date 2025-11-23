import React, { useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';
import ImportModal from '../components/ImportModal';
import ExportButton from '../components/ExportButton';
import HistorySidebar from '../components/HistorySidebar';
import productsApi from '../api/productsApi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    unit: '',
    category: '',
    brand: '',
    stock: 0,
  });

  const fetchProducts = async () => {
    try {
      const res = await productsApi.get('/');
      setProducts(res.data);
      setFilteredProducts(res.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(res.data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(result);
  }, [searchQuery, categoryFilter, products]);

  const handleAddProduct = async () => {
    if (!newProduct.name) {
      alert('Product name is required');
      return;
    }

    try {
      await productsApi.post('/', newProduct);
      setIsAddingProduct(false);
      setNewProduct({ name: '', unit: '', category: '', brand: '', stock: 0 });
      fetchProducts();
    } catch (error) {
      console.error('Failed to add product', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', color: '#212529' }}>Inventory Management System</h1>

      {/* Header Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        {/* Left side: Search and Filter */}
        <div style={{ display: 'flex', gap: '12px', flex: '1', minWidth: '300px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '10px 16px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '150px',
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAddingProduct(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ➕ Add New Product
          </button>
        </div>

        {/* Right side: Import/Export */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsImportModalOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            📤 Import CSV
          </button>
          <ExportButton />
        </div>
      </div>

      {/* Add Product Form */}
      {isAddingProduct && (
        <div
          style={{
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #007bff',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Add New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <input
              type="text"
              placeholder="Product Name *"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Unit (e.g., kg, pcs)"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Brand"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
            />
            <input
              type="number"
              placeholder="Initial Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
              style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
              min="0"
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={handleAddProduct}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Save Product
            </button>
            <button
              onClick={() => {
                setIsAddingProduct(false);
                setNewProduct({ name: '', unit: '', category: '', brand: '', stock: 0 });
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Count */}
      <div style={{ marginBottom: '16px', color: '#6c757d', fontSize: '14px' }}>
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        refresh={fetchProducts}
        onSelectForHistory={setSelectedProductForHistory}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchProducts}
      />

      {/* History Sidebar */}
      <HistorySidebar
        product={selectedProductForHistory}
        onClose={() => setSelectedProductForHistory(null)}
      />
    </div>
  );
}
