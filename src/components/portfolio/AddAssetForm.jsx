import React, { useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';

const AddAssetForm = ({ exchangeId, onAddAsset, onCancel, isLoading }) => {
  const [asset, setAsset] = useState({
    symbol: '',
    name: '',
    amount: ''
  });
  const [error, setError] = useState('');
  
  // Lista de criptomonedas comunes para autocompletar
  const commonCryptos = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'XRP', name: 'Ripple' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'AVAX', name: 'Avalanche' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'MATIC', name: 'Polygon' },
    { symbol: 'LINK', name: 'Chainlink' },
    { symbol: 'UNI', name: 'Uniswap' },
    { symbol: 'ATOM', name: 'Cosmos' },
    { symbol: 'LTC', name: 'Litecoin' },
    { symbol: 'ALGO', name: 'Algorand' },
    { symbol: 'NEAR', name: 'NEAR Protocol' },
    { symbol: 'FTM', name: 'Fantom' },
    { symbol: 'SAND', name: 'The Sandbox' },
    { symbol: 'MANA', name: 'Decentraland' },
    { symbol: 'AXS', name: 'Axie Infinity' },
    { symbol: 'AAVE', name: 'Aave' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'DAI', name: 'Dai' },
    { symbol: 'BUSD', name: 'Binance USD' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setAsset({
      ...asset,
      [name]: value
    });
    
    // Si se selecciona un símbolo, autocompletar el nombre
    if (name === 'symbol') {
      const selectedCrypto = commonCryptos.find(crypto => crypto.symbol === value);
      if (selectedCrypto) {
        setAsset(prev => ({
          ...prev,
          symbol: value,
          name: selectedCrypto.name
        }));
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!asset.symbol.trim()) {
      setError('Por favor, selecciona una criptomoneda.');
      return;
    }
    
    if (!asset.name.trim()) {
      setError('Por favor, introduce el nombre de la criptomoneda.');
      return;
    }
    
    const amount = parseFloat(asset.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, introduce una cantidad válida mayor que cero.');
      return;
    }
    
    // Enviar el activo con la cantidad como número
    onAddAsset({
      ...asset,
      amount: amount
    });
  };
  
  return (
    <div className="add-asset-form">
      <div className="form-header">
        <h3>Añadir Nuevo Activo</h3>
        <button className="close-button" onClick={onCancel} disabled={isLoading}>
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="symbol">Símbolo:</label>
          <select
            id="symbol"
            name="symbol"
            value={asset.symbol}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="">Selecciona una criptomoneda</option>
            {commonCryptos.map(crypto => (
              <option key={crypto.symbol} value={crypto.symbol}>
                {crypto.symbol} - {crypto.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={asset.name}
            onChange={handleChange}
            placeholder="Ej: Bitcoin"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Cantidad:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={asset.amount}
            onChange={handleChange}
            placeholder="Ej: 0.5"
            min="0"
            step="any"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner-icon" />
                Añadiendo...
              </>
            ) : (
              'Añadir Activo'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAssetForm; 