import React from 'react';

const TradingChart = () => {
  return (
    <svg width="100%" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
      {/* Fondo del gráfico */}
      <rect x="0" y="0" width="800" height="300" fill="#f8fafc" />
      
      {/* Líneas de cuadrícula */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line 
          key={`horizontal-${i}`}
          x1="50" 
          y1={50 + i * 40} 
          x2="750" 
          y2={50 + i * 40} 
          stroke="#e2e8f0" 
          strokeWidth="1"
        />
      ))}
      
      {Array.from({ length: 8 }).map((_, i) => (
        <line 
          key={`vertical-${i}`}
          x1={100 + i * 90} 
          y1="30" 
          x2={100 + i * 90} 
          y2="250" 
          stroke="#e2e8f0" 
          strokeWidth="1"
        />
      ))}
      
      {/* Línea de precio (azul) */}
      <path 
        d="M100,200 L190,180 L280,190 L370,150 L460,120 L550,140 L640,100 L730,70" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="3"
      />
      
      {/* Área bajo la línea de precio */}
      <path 
        d="M100,200 L190,180 L280,190 L370,150 L460,120 L550,140 L640,100 L730,70 L730,250 L100,250 Z" 
        fill="url(#blueGradient)" 
        fillOpacity="0.2"
      />
      
      {/* Línea de volumen (verde) */}
      <path 
        d="M100,220 L190,210 L280,215 L370,200 L460,180 L550,190 L640,170 L730,150" 
        fill="none" 
        stroke="#10b981" 
        strokeWidth="2"
      />
      
      {/* Puntos de datos */}
      {[
        [100, 200], [190, 180], [280, 190], [370, 150], 
        [460, 120], [550, 140], [640, 100], [730, 70]
      ].map(([x, y], i) => (
        <circle 
          key={`point-${i}`}
          cx={x} 
          cy={y} 
          r="4" 
          fill="#3b82f6"
        />
      ))}
      
      {/* Definición del gradiente */}
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Etiquetas del eje X */}
      {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'].map((month, i) => (
        <text 
          key={`month-${i}`}
          x={100 + (i+1) * 90} 
          y="270" 
          fontSize="12" 
          textAnchor="middle" 
          fill="#64748b"
        >
          {month}
        </text>
      ))}
      
      {/* Etiquetas del eje Y */}
      {[0, 100, 200, 300, 400].map((value, i) => (
        <text 
          key={`value-${i}`}
          x="40" 
          y={250 - i * 50} 
          fontSize="12" 
          textAnchor="end" 
          fill="#64748b"
        >
          {value}
        </text>
      ))}
    </svg>
  );
};

export default TradingChart; 