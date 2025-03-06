import React from 'react';

const PerformanceMetrics = () => {
  return (
    <div className="performance-metrics-container">
      <h3>Métricas de Rendimiento</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Win Rate</h4>
          <p className="metric-value">65%</p>
        </div>
        
        <div className="metric-card">
          <h4>Profit Factor</h4>
          <p className="metric-value">1.8</p>
        </div>
        
        <div className="metric-card">
          <h4>Expectativa</h4>
          <p className="metric-value">0.35</p>
        </div>
        
        <div className="metric-card">
          <h4>Drawdown Máximo</h4>
          <p className="metric-value">15%</p>
        </div>
        
        <div className="metric-card">
          <h4>Ratio Sharpe</h4>
          <p className="metric-value">1.2</p>
        </div>
        
        <div className="metric-card">
          <h4>Ratio Sortino</h4>
          <p className="metric-value">1.5</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 