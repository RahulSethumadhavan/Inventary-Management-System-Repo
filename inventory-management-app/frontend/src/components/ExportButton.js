import React, { useState } from 'react';
import productsApi from '../api/productsApi';

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await productsApi.get('/export', {
        responseType: 'blob',
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export products', error);
      alert('Failed to export products. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      style={{
        padding: '10px 20px',
        backgroundColor: isExporting ? '#6c757d' : '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isExporting ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      {isExporting ? 'Exporting...' : '📥 Export CSV'}
    </button>
  );
}
