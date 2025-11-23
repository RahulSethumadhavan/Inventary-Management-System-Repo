import React, { useState, useRef } from 'react';
import productsApi from '../api/productsApi';

export default function ImportModal({ isOpen, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      alert('Please select a valid CSV file');
      e.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file first');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      const response = await productsApi.post('/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      
      if (response.data.addedCount > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to import CSV', error);
      alert('Failed to import CSV. Please check the file format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          minWidth: '400px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Import Products from CSV</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ marginBottom: '10px', color: '#6c757d' }}>
            CSV file should have headers: name, unit, category, brand, stock, status, image
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
            }}
          />
        </div>

        {uploadResult && (
          <div
            style={{
              padding: '12px',
              marginBottom: '20px',
              backgroundColor: uploadResult.addedCount > 0 ? '#d4edda' : '#f8d7da',
              border: `1px solid ${uploadResult.addedCount > 0 ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              color: uploadResult.addedCount > 0 ? '#155724' : '#721c24',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Import Results:</p>
            <p style={{ margin: '4px 0' }}>✓ Added: {uploadResult.addedCount} products</p>
            <p style={{ margin: '4px 0' }}>⚠ Skipped: {uploadResult.skippedCount} products</p>
            {uploadResult.skipped && uploadResult.skipped.length > 0 && (
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
                  View skipped items
                </summary>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {uploadResult.skipped.slice(0, 10).map((item, idx) => (
                    <li key={idx} style={{ fontSize: '14px' }}>
                      {item.row?.name || 'Unknown'} - {item.reason}
                    </li>
                  ))}
                  {uploadResult.skipped.length > 10 && (
                    <li style={{ fontSize: '14px', fontStyle: 'italic' }}>
                      ... and {uploadResult.skipped.length - 10} more
                    </li>
                  )}
                </ul>
              </details>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
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
            Close
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedFile && !isUploading ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed',
              fontSize: '14px',
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}
