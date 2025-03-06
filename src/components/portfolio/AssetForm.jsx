import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const AssetForm = () => {
  const { addAsset } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    type: 'stock',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'El símbolo es obligatorio';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor que 0';
    }
    
    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'El precio de compra debe ser mayor que 0';
    }
    
    if (!formData.currentPrice || formData.currentPrice <= 0) {
      newErrors.currentPrice = 'El precio actual debe ser mayor que 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convertir valores numéricos
      const newAsset = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentPrice: parseFloat(formData.currentPrice)
      };
      
      addAsset(newAsset);
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Activo añadido correctamente');
      
      // Limpiar formulario
      setFormData({
        name: '',
        symbol: '',
        type: 'stock',
        quantity: '',
        purchasePrice: '',
        currentPrice: '',
        notes: ''
      });
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  return (
    <div className="asset-form-container">
      <h3>Añadir Nuevo Activo</h3>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      <form className="asset-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre del Activo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="symbol">Símbolo/Ticker</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            className={errors.symbol ? 'error' : ''}
          />
          {errors.symbol && <div className="error-message">{errors.symbol}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Tipo de Activo</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="stock">Acciones</option>
            <option value="crypto">Criptomonedas</option>
            <option value="etf">ETF</option>
            <option value="bond">Bonos</option>
            <option value="commodity">Materias Primas</option>
            <option value="other">Otros</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Cantidad</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            step="0.01"
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <div className="error-message">{errors.quantity}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="purchasePrice">Precio de Compra</label>
          <input
            type="number"
            id="purchasePrice"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            step="0.01"
            className={errors.purchasePrice ? 'error' : ''}
          />
          {errors.purchasePrice && <div className="error-message">{errors.purchasePrice}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="currentPrice">Precio Actual</label>
          <input
            type="number"
            id="currentPrice"
            name="currentPrice"
            value={formData.currentPrice}
            onChange={handleChange}
            step="0.01"
            className={errors.currentPrice ? 'error' : ''}
          />
          {errors.currentPrice && <div className="error-message">{errors.currentPrice}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        
        <button type="submit" className="btn-submit">Añadir Activo</button>
      </form>
    </div>
  );
};

export default AssetForm; 