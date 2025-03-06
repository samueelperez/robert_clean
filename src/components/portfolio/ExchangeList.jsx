import React, { useState } from 'react';
import { FaTrash, FaEdit, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import CryptoLogo from './CryptoLogo';

const ExchangeList = ({ exchanges, onSelectExchange, onRemoveExchange, onRemoveAsset, onUpdateAsset }) => {
  const [expandedExchange, setExpandedExchange] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  
  // Expandir/colapsar un exchange
  const toggleExpand = (exchangeId) => {
    if (expandedExchange === exchangeId) {
      setExpandedExchange(null);
    } else {
      setExpandedExchange(exchangeId);
    }
  };
  
  // Iniciar edición haciendo clic en la cantidad
  const startEditing = (exchangeId, assetId, currentAmount) => {
    setEditingAsset({ exchangeId, assetId });
    setEditAmount(currentAmount.toString());
  };
  
  // Guardar la nueva cantidad
  const saveAmount = (exchangeId, assetId) => {
    const newAmount = parseFloat(editAmount);
    if (!isNaN(newAmount) && newAmount >= 0) {
      onUpdateAsset(exchangeId, assetId, { amount: newAmount });
    }
    setEditingAsset(null);
  };
  
  // Manejar Enter o Escape
  const handleKeyPress = (e, exchangeId, assetId) => {
    if (e.key === 'Enter') {
      saveAmount(exchangeId, assetId);
    } else if (e.key === 'Escape') {
      setEditingAsset(null);
    }
  };
  
  // Formatear la fecha de última actualización
  const formatLastUpdated = (dateString) => {
    try {
      return `Actualizado ${formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es })}`;
    } catch (error) {
      return 'Fecha desconocida';
    }
  };
  
  // Función para formatear números de criptomonedas
  const formatCryptoAmount = (amount) => {
    // Si es un objeto, intentar extraer la propiedad amount
    if (typeof amount === 'object' && amount !== null) {
      if ('amount' in amount) {
        amount = amount.amount;
      } else {
        return '0'; // Si no tiene la propiedad amount
      }
    }
    
    if (amount === undefined || amount === null) return '0';
    
    // Convertir a string y eliminar ceros finales
    const str = amount.toString();
    
    // Si no tiene decimales, devolver el entero
    if (!str.includes('.')) return str;
    
    // Eliminar ceros al final pero mantener los dígitos significativos
    return str.replace(/\.?0+$/, '');
  };
  
  // Función para formatear valores monetarios y manejar casos de error
  const formatCurrencyValue = (value) => {
    // Verificar si el valor es un número válido
    if (value === undefined || value === null || isNaN(value)) {
      return "$0.00";
    }
    
    // Formatear el valor como moneda
    return `$${value.toFixed(2)}`;
  };
  
  return (
    <div className="exchange-list">
      {exchanges.length === 0 ? (
        <div className="empty-state">
          <p>No has añadido ningún exchange todavía.</p>
          <p>Haz clic en "Añadir Exchange" para comenzar.</p>
        </div>
      ) : (
        exchanges.map(exchange => (
          <div key={exchange.id} className="exchange-card">
            <div className="exchange-header" onClick={() => toggleExpand(exchange.id)}>
              <div className="exchange-info">
                <h3>{exchange.name}</h3>
                <p className="exchange-value">${exchange.totalValue.toFixed(2)} USDT</p>
              </div>
              <div className="exchange-actions">
                <button 
                  className="add-asset-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectExchange(exchange.id);
                  }}
                >
                  <FaPlus /> Añadir Activo
                </button>
                <button 
                  className="remove-exchange-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`¿Estás seguro de que deseas eliminar ${exchange.name}?`)) {
                      onRemoveExchange(exchange.id);
                    }
                  }}
                >
                  <FaTrash />
                </button>
                {expandedExchange === exchange.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            
            {expandedExchange === exchange.id && (
              <div className="exchange-assets-container">
                <div className="assets-header">
                  <h4>Assets en {exchange.name}</h4>
                  <div className="assets-filter">
                    <select className="filter-select">
                      <option value="all">Todos los assets</option>
                      <option value="value-desc">Mayor valor</option>
                      <option value="value-asc">Menor valor</option>
                    </select>
                  </div>
                </div>
                
                {exchange.assets.length === 0 ? (
                  <div className="empty-assets-message">
                    <p>No hay activos en este exchange.</p>
                    <button 
                      className="add-first-asset-button"
                      onClick={() => onSelectExchange(exchange.id)}
                    >
                      <FaPlus /> Añadir tu primer activo
                    </button>
                  </div>
                ) : (
                  <div className="assets-card-grid">
                    {exchange.assets.map(asset => (
                      <div key={asset.id} className="asset-card exchange-asset">
                        <div className="asset-card-header">
                          <div className="asset-symbol-container">
                            <CryptoLogo symbol={asset.symbol} name={asset.name} />
                            <div className="asset-name-container">
                              <h4 className="asset-symbol-text">{asset.symbol}</h4>
                              <p className="asset-full-name">{asset.name}</p>
                            </div>
                          </div>
                          <div className="asset-card-actions">
                            <button 
                              className="remove-asset-button"
                              onClick={() => {
                                if (window.confirm(`¿Estás seguro de que deseas eliminar ${asset.symbol}?`)) {
                                  onRemoveAsset(exchange.id, asset.id);
                                }
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        
                        <div className="asset-card-content">
                          <div className="asset-info-item">
                            <span className="info-label">Precio</span>
                            <span className="info-value price">
                              {formatCurrencyValue(asset.priceUSDT)}
                            </span>
                          </div>
                          
                          <div className="asset-info-item">
                            <span className="info-label">Cantidad</span>
                            {editingAsset && 
                             editingAsset.exchangeId === exchange.id && 
                             editingAsset.assetId === asset.id ? (
                              <input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                onBlur={() => saveAmount(exchange.id, asset.id)}
                                onKeyDown={(e) => handleKeyPress(e, exchange.id, asset.id)}
                                min="0"
                                step="any"
                                className="edit-amount-input"
                                autoFocus
                              />
                            ) : (
                              <span 
                                className="info-value amount editable"
                                onClick={() => startEditing(exchange.id, asset.id, asset.amount)}
                              >
                                {formatCryptoAmount(asset.amount)}
                              </span>
                            )}
                          </div>
                          
                          <div className="asset-info-item">
                            <span className="info-label">Valor Total</span>
                            <span className="info-value total">
                              {formatCurrencyValue(asset.valueUSDT)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="asset-card-footer">
                          <span className="last-updated-text">
                            {formatLastUpdated(asset.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ExchangeList; 