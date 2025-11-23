import React, { useState } from 'react';
import productsApi from '../api/productsApi';

export default function ProductRow({ product, refresh, onSelectForHistory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...product });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...product });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...product });
  };

  const handleSave = async () => {
    try {
      await productsApi.put(`/${product.id}`, formData);
      setIsEditing(false);
      refresh();
    } catch (error) {
      console.error('Failed to update product', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productsApi.delete(`/${product.id}`);
        refresh();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const getStatusDisplay = () => {
    const stock = isEditing ? formData.stock : product.stock;
    if (stock === 0 || stock === '0') {
      return <span style={{ color: '#dc3545', fontWeight: '500' }}>Out of Stock</span>;
    }
    return <span style={{ color: '#28a745', fontWeight: '500' }}>In Stock</span>;
  };

  return (
    <tr style={{ borderBottom: '1px solid #dee2e6' }}>
      <td style={{ padding: '12px 8px' }}>
        {isEditing ? (
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{ width: '100%', padding: '6px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
        ) : (
          product.name
        )}
      </td>
      <td style={{ padding: '12px 8px' }}>
        {isEditing ? (
          <input
            type="text"
            value={formData.unit || ''}
            onChange={(e) => handleChange('unit', e.target.value)}
            style={{ width: '100%', padding: '6px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
        ) : (
          product.unit || '-'
        )}
      </td>
      <td style={{ padding: '12px 8px' }}>
        {isEditing ? (
          <input
            type="text"
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            style={{ width: '100%', padding: '6px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
        ) : (
          product.category || '-'
        )}
      </td>
      <td style={{ padding: '12px 8px' }}>
        {isEditing ? (
          <input
            type="text"
            value={formData.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
            style={{ width: '100%', padding: '6px', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
        ) : (
          product.brand || '-'
        )}
      </td>
      <td style={{ padding: '12px 8px' }}>
        {isEditing ? (
          <input
            type="number"
            value={formData.stock || 0}
            onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
            style={{ width: '100%', padding: '6px', border: '1px solid #ced4da', borderRadius: '4px' }}
            min="0"
          />
        ) : (
          product.stock
        )}
      </td>
      <td style={{ padding: '12px 8px' }}>{getStatusDisplay()}</td>
      <td style={{ padding: '12px 8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onSelectForHistory(product)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                History
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
