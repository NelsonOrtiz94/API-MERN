import React from 'react';

const Loading = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>Cargando...</p>
    </div>
  );
};

export default Loading;
