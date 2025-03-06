import React from 'react';

const PerformanceMetrics = () => {
  return (
    <div className="performance-metrics">
      <h3>Métricas de Rendimiento</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Drawdown Máximo</h4>
          <p className="metric-value">15%</p>
        </div>
        
        <div className="metric-card">
          <h4>Ratio Sharpe</h4>
          <p className="metric-value">1.2</p>
        </div>
        
        <div className="metric-card">
          <h4>Expectativa</h4>
          <p className="metric-value">0.35</p>
        </div>
        
        <div className="metric-card">
          <h4>Mejor Día</h4>
          <p className="metric-value">+120€</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 