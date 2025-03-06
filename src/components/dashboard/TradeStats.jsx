import React from 'react';

const TradeStats = () => {
  // Datos de ejemplo
  const stats = {
    totalTrades: 120,
    winRate: 65,
    profitFactor: 1.8,
    averageProfit: 42
  };

  return (
    <div className="trade-stats">
      <div className="stat-card">
        <h3>Total Operaciones</h3>
        <p className="stat-value">{stats.totalTrades}</p>
      </div>
      
      <div className="stat-card">
        <h3>Win Rate</h3>
        <p className="stat-value">{stats.winRate}%</p>
      </div>
      
      <div className="stat-card">
        <h3>Factor de Beneficio</h3>
        <p className="stat-value">{stats.profitFactor}</p>
      </div>
      
      <div className="stat-card">
        <h3>Beneficio Medio</h3>
        <p className="stat-value">{stats.averageProfit}€</p>
      </div>
    </div>
  );
};

export default TradeStats; 