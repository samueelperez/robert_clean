import React from 'react';

// Este componente es solo para visualizar cómo se vería el favicon
// No es necesario incluirlo en la aplicación final
const FaviconGenerator = () => {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Fondo */}
      <rect width="64" height="64" rx="12" fill="#2563eb" />
      
      {/* Gráfico de velas */}
      <rect x="12" y="20" width="4" height="24" fill="white" />
      <rect x="12" y="16" width="4" height="32" fill="white" opacity="0.3" />
      
      <rect x="20" y="28" width="4" height="16" fill="white" />
      <rect x="20" y="24" width="4" height="24" fill="white" opacity="0.3" />
      
      <rect x="28" y="16" width="4" height="28" fill="white" />
      <rect x="28" y="12" width="4" height="36" fill="white" opacity="0.3" />
      
      <rect x="36" y="32" width="4" height="12" fill="white" />
      <rect x="36" y="28" width="4" height="20" fill="white" opacity="0.3" />
      
      <rect x="44" y="24" width="4" height="20" fill="white" />
      <rect x="44" y="20" width="4" height="28" fill="white" opacity="0.3" />
      
      {/* Línea de tendencia */}
      <path d="M10,40 L54,24" stroke="white" strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  );
};

export default FaviconGenerator; 