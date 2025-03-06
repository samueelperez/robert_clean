import React, { useState } from 'react';
import { useTrades } from '../../context/TradeContext';

const TradeForm = () => {
  const { addTrade } = useTrades();
  const [formData, setFormData] = useState({
    instrument: '',
    type: 'BUY',
    entryPrice: '',
    exitPrice: '',
    size: '',
    date: '',
    result: 'WIN',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcular el beneficio
    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = parseFloat(formData.exitPrice);
    const size = parseFloat(formData.size);
    
    let profit;
    if (formData.type === 'BUY') {
      profit = (exitPrice - entryPrice) * size;
    } else {
      profit = (entryPrice - exitPrice) * size;
    }
    
    // Añadir la operación al contexto
    addTrade({
      ...formData,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: parseFloat(formData.exitPrice),
      size: parseFloat(formData.size),
      profit: Math.round(profit * 100) / 100
    });
    
    // Resetear el formulario
    setFormData({
      instrument: '',
      type: 'BUY',
      entryPrice: '',
      exitPrice: '',
      size: '',
      date: '',
      result: 'WIN',
      notes: ''
    });
  };

  return (
    <div className="trade-form">
      <h3>Registrar Nueva Operación</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="instrument">Instrumento</label>
            <input
              type="text"
              id="instrument"
              name="instrument"
              value={formData.instrument}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="BUY">Compra</option>
              <option value="SELL">Venta</option>
            </select>
          </div>
          
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
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="entryPrice">Precio de Entrada</label>
            <input
              type="number"
              id="entryPrice"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              step="0.00001"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="exitPrice">Precio de Salida</label>
            <input
              type="number"
              id="exitPrice"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleChange}
              step="0.00001"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="size">Tamaño</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="result">Resultado</label>
            <select
              id="result"
              name="result"
              value={formData.result}
              onChange={handleChange}
            >
              <option value="WIN">Ganancia</option>
              <option value="LOSS">Pérdida</option>
              <option value="BREAKEVEN">Punto de Equilibrio</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notas</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        
        <button type="submit" className="btn-primary">Guardar Operación</button>
      </form>
    </div>
  );
};

export default TradeForm; 