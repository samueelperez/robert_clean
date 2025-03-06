import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import CryptoSelector from './CryptoSelector';
import './NewOperationForm.css';

const NewOperationForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    type: 'buy', // Por defecto es compra
    crypto: null, // Utilizará el nuevo selector
    fiat: 'EUR', // Por defecto euros
    amount: '',
    price: '',
    total: '',
    exchange: '',
    notes: ''
  });
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Calcular el total si tenemos precio y cantidad
    if (name === 'amount' || name === 'price') {
      const amount = name === 'amount' ? parseFloat(value) : parseFloat(formData.amount);
      const price = name === 'price' ? parseFloat(value) : parseFloat(formData.price);
      
      if (!isNaN(amount) && !isNaN(price)) {
        setFormData(prev => ({
          ...prev,
          total: (amount * price).toFixed(2)
        }));
      }
    }
  };
  
  // Manejar selección de criptomoneda
  const handleCryptoSelect = (selectedCrypto) => {
    setFormData({
      ...formData,
      crypto: selectedCrypto
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.crypto) {
      alert('Por favor, selecciona una criptomoneda');
      return;
    }
    
    if (!formData.amount || !formData.price) {
      alert('Por favor, completa la cantidad y el precio');
      return;
    }
    
    // Crear objeto de operación
    const operation = {
      id: Date.now().toString(), // ID temporal
      date: formData.date,
      type: formData.type,
      cryptoSymbol: formData.crypto.symbol,
      cryptoName: formData.crypto.name,
      fiat: formData.fiat,
      amount: parseFloat(formData.amount),
      price: parseFloat(formData.price),
      total: parseFloat(formData.total),
      exchange: formData.exchange,
      notes: formData.notes
    };
    
    // Enviar la operación al componente padre
    onSubmit(operation);
    
    // Resetear el formulario
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'buy',
      crypto: null,
      fiat: 'EUR',
      amount: '',
      price: '',
      total: '',
      exchange: '',
      notes: ''
    });
  };
  
  return (
    <div className="new-operation-form-container">
      <div className="form-header">
        <h2>Nueva Operación</h2>
        <button className="close-button" onClick={onCancel}>
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="new-operation-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Tipo</label>
            <div className="operation-type-selector">
              <button
                type="button"
                className={`type-btn ${formData.type === 'buy' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, type: 'buy'})}
              >
                Compra
              </button>
              <button
                type="button"
                className={`type-btn ${formData.type === 'sell' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, type: 'sell'})}
              >
                Venta
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <CryptoSelector 
            onSelect={handleCryptoSelect} 
            label="Criptomoneda" 
            placeholder="Buscar criptomoneda..."
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Cantidad</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="any"
              placeholder="Ej: 0.5"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Precio unitario</label>
            <div className="price-input-group">
              <select 
                name="fiat" 
                value={formData.fiat} 
                onChange={handleChange}
                className="fiat-selector"
              >
                <option value="EUR">€</option>
                <option value="USD">$</option>
                <option value="GBP">£</option>
              </select>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="any"
                placeholder="Ej: 25000"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="total">Total</label>
            <div className="total-input-group">
              <span className="fiat-symbol">
                {formData.fiat === 'EUR' ? '€' : formData.fiat === 'USD' ? '$' : '£'}
              </span>
              <input
                type="number"
                id="total"
                name="total"
                value={formData.total}
                onChange={handleChange}
                min="0"
                step="any"
                placeholder="Calculado automáticamente"
                readOnly
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="exchange">Exchange/Plataforma</label>
            <input
              type="text"
              id="exchange"
              name="exchange"
              value={formData.exchange}
              onChange={handleChange}
              placeholder="Ej: Binance, Coinbase"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group notes-group">
            <label htmlFor="notes">Notas</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notas adicionales sobre la operación"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="submit-button">
            <FaPlus /> Añadir Operación
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOperationForm; 