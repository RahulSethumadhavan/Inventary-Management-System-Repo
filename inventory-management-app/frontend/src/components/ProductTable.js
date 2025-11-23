import React from 'react';
import ProductRow from './ProductRow';

export default function ProductTable({ products, refresh, onSelectForHistory }) {
  if (products.length === 0) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#6c757d',
        }}
      >
        <p style={{ fontSize: '18px', margin: 0 }}>No products found</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Add a new product or import from CSV to get started
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Name</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Unit</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Category</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Brand</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Stock</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Status</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              refresh={refresh}
              onSelectForHistory={onSelectForHistory}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
