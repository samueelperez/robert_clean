import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import ExchangeList from '../components/portfolio/ExchangeList';
import AddExchangeForm from '../components/portfolio/AddExchangeForm';
import AddAssetForm from '../components/portfolio/AddAssetForm';
import PortfolioDistribution from '../components/portfolio/PortfolioDistribution';
import { FaSpinner, FaSyncAlt } from 'react-icons/fa';
import '../styles/Portfolio.css';

const Portfolio = () => {
  const { 
    exchanges, 
    totalValue, 
    addExchange, 
    removeExchange,
    addAsset,
    removeAsset,
    updateAsset,
    isLoading,
    error,
    refreshPrices
  } = usePortfolio();
  
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [showAddExchangeForm, setShowAddExchangeForm] = useState(false);
  const [showAddAssetForm, setShowAddAssetForm] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Manejar la selección de un exchange
  const handleSelectExchange = (exchangeId) => {
    setSelectedExchange(exchangeId);
    setShowAddAssetForm(true);
  };

  // Manejar la adición de un nuevo exchange
  const handleAddExchange = (exchangeName) => {
    setLocalLoading(true);
    addExchange(exchangeName);
    setShowAddExchangeForm(false);
    setLocalLoading(false);
  };

  // Manejar la adición de un nuevo activo
  const handleAddAsset = async (asset) => {
    setLocalLoading(true);
    await addAsset(selectedExchange, asset);
    setShowAddAssetForm(false);
    setSelectedExchange(null);
    setLocalLoading(false);
  };

  // Manejar la actualización de precios
  const handleRefreshPrices = async () => {
    setLocalLoading(true);
    await refreshPrices();
    setLocalLoading(false);
  };

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h1>Mi Portfolio</h1>
        <button 
          className="add-exchange-button"
          onClick={() => setShowAddExchangeForm(true)}
          disabled={isLoading || localLoading}
        >
          Añadir Exchange
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {(isLoading || localLoading) && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <p>Cargando...</p>
          </div>
        </div>
      )}
      
      <PortfolioSummary 
        onRefreshPrices={handleRefreshPrices} 
        isRefreshing={isLoading || localLoading}
      />
      
      <div className="portfolio-content">
        <div className="exchanges-section">
          <h2>Mis Exchanges</h2>
          {exchanges.length === 0 ? (
            <div className="empty-state">
              <p>No has añadido ningún exchange todavía.</p>
              <button 
                className="add-first-exchange-button"
                onClick={() => setShowAddExchangeForm(true)}
              >
                Añadir mi primer exchange
              </button>
            </div>
          ) : (
            <ExchangeList 
              exchanges={exchanges} 
              onSelectExchange={handleSelectExchange}
              onRemoveExchange={removeExchange}
              onRemoveAsset={removeAsset}
              onUpdateAsset={updateAsset}
            />
          )}
        </div>
        
        <div className="distribution-section">
          <h2>Distribución del Portfolio</h2>
          <PortfolioDistribution exchanges={exchanges} />
        </div>
      </div>

      {showAddExchangeForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddExchangeForm 
              onAddExchange={handleAddExchange} 
              onCancel={() => setShowAddExchangeForm(false)}
              isLoading={localLoading}
            />
          </div>
        </div>
      )}

      {showAddAssetForm && selectedExchange && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddAssetForm 
              exchangeId={selectedExchange}
              onAddAsset={handleAddAsset}
              onCancel={() => {
                setShowAddAssetForm(false);
                setSelectedExchange(null);
              }}
              isLoading={localLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio; 