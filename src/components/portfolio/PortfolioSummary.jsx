import React from 'react';
import { FaWallet, FaExchangeAlt, FaCoins, FaSync } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';

const PortfolioSummary = ({ onRefreshPrices, isRefreshing }) => {
  const { totalValue, exchanges } = usePortfolio();
  
  // Calcular el número total de activos
  const totalAssets = exchanges.reduce((sum, exchange) => sum + exchange.assets.length, 0);
  
  return (
    <div className="portfolio-summary">
      <div className="summary-card total-value">
        <div className="card-icon">
          <FaWallet />
        </div>
        <div className="card-content">
          <h3>Valor Total</h3>
          <p className="value">${totalValue.toFixed(2)} USDT</p>
        </div>
      </div>
      
      <div className="summary-card exchanges-count">
        <div className="card-icon">
          <FaExchangeAlt />
        </div>
        <div className="card-content">
          <h3>Exchanges</h3>
          <p className="value">{exchanges.length}</p>
        </div>
      </div>
      
      <div className="summary-card assets-count">
        <div className="card-icon">
          <FaCoins />
        </div>
        <div className="card-content">
          <h3>Activos</h3>
          <p className="value">{totalAssets}</p>
        </div>
      </div>
      
      <button 
        className="refresh-button" 
        onClick={onRefreshPrices}
        disabled={isRefreshing}
      >
        <FaSync className={isRefreshing ? 'spinning' : ''} />
        {isRefreshing ? 'Actualizando...' : 'Actualizar Precios'}
      </button>
    </div>
  );
};

export default PortfolioSummary; 