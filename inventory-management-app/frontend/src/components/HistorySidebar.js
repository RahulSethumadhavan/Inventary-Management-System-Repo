import React, { useEffect, useState } from 'react';
import productsApi from '../api/productsApi';

export default function HistorySidebar({ product, onClose }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      fetchHistory();
    }
  }, [product]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await productsApi.get(`/${product.id}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '400px',
        backgroundColor: 'white',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Inventory History</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6c757d',
              padding: '0',
              width: '30px',
              height: '30px',
            }}
          >
            ×
          </button>
        </div>
        <p style={{ margin: '8px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
          Product: <strong>{product.name}</strong>
        </p>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6c757d' }}>
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6c757d' }}>
            No history records found for this product.
          </div>
        ) : (
          <div>
            {history.map((record, index) => (
              <div
                key={record.id}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: '4px solid #007bff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
                    Change #{history.length - index}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    {new Date(record.change_date).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                      Old Quantity
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#dc3545' }}>
                      {record.old_quantity}
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', color: '#6c757d' }}>→</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                      New Quantity
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#28a745' }}>
                      {record.new_quantity}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                      Change
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: record.new_quantity - record.old_quantity > 0 ? '#28a745' : '#dc3545',
                      }}
                    >
                      {record.new_quantity - record.old_quantity > 0 ? '+' : ''}
                      {record.new_quantity - record.old_quantity}
                    </div>
                  </div>
                </div>
                {record.user_info && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
                    User: {record.user_info}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
