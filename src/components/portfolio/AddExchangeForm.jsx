import React, { useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';

const AddExchangeForm = ({ onAddExchange, onCancel, isLoading }) => {
  const [exchangeName, setExchangeName] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!exchangeName.trim()) {
      setError('Por favor, introduce un nombre para el exchange.');
      return;
    }
    
    onAddExchange(exchangeName.trim());
  };
  
  return (
    <div className="add-exchange-form">
      <div className="form-header">
        <h3>Añadir Nuevo Exchange</h3>
        <button className="close-button" onClick={onCancel} disabled={isLoading}>
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="exchangeName">Nombre del Exchange:</label>
          <input
            type="text"
            id="exchangeName"
            value={exchangeName}
            onChange={(e) => setExchangeName(e.target.value)}
            placeholder="Ej: Binance, Coinbase, etc."
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
              'Añadir Exchange'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExchangeForm; 