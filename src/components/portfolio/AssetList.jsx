import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const AssetList = () => {
  const { assets, updateAsset, deleteAsset } = usePortfolio();
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    type: '',
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
    notes: ''
  });

  // Formatear números para mostrar
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };
  
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'percent', 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(value / 100);
  };

  // Iniciar edición de un activo
  const handleEdit = (asset) => {
    setEditingAsset(asset.id);
    setFormData({ ...asset });
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'purchasePrice' || name === 'currentPrice' 
        ? parseFloat(value) 
        : value
    });
  };

  // Guardar cambios
  const handleSave = () => {
    updateAsset(editingAsset, formData);
    setEditingAsset(null);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingAsset(null);
  };

  // Confirmar eliminación
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este activo?')) {
      deleteAsset(id);
    }
  };

  // Calcular ganancia/pérdida para un activo
  const calculateProfitLoss = (asset) => {
    const invested = asset.quantity * asset.purchasePrice;
    const current = asset.quantity * asset.currentPrice;
    return current - invested;
  };

  // Calcular porcentaje de ganancia/pérdida
  const calculateProfitLossPercentage = (asset) => {
    const invested = asset.quantity * asset.purchasePrice;
    const current = asset.quantity * asset.currentPrice;
    if (invested === 0) return 0;
    return ((current - invested) / invested) * 100;
  };

  if (assets.length === 0) {
    return (
      <div className="empty-state">
        <h3>No hay activos en tu portfolio</h3>
        <p>Añade tu primer activo para comenzar a hacer seguimiento de tu portfolio.</p>
      </div>
    );
  }

  return (
    <div className="asset-list">
      <h3>Mis Activos</h3>
      
      <div className="asset-table-container">
        <table className="asset-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Símbolo</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Precio Compra</th>
              <th>Precio Actual</th>
              <th>Valor Total</th>
              <th>Ganancia/Pérdida</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.id}>
                {editingAsset === asset.id ? (
                  // Modo edición
                  <>
                    <td>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        name="symbol" 
                        value={formData.symbol} 
                        onChange={handleChange} 
                      />
                    </td>
                    <td>
                      <select 
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
                    </td>
                    <td>
                      <input 
                        type="number" 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleChange} 
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        name="purchasePrice" 
                        value={formData.purchasePrice} 
                        onChange={handleChange} 
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        name="currentPrice" 
                        value={formData.currentPrice} 
                        onChange={handleChange} 
                        step="0.01"
                      />
                    </td>
                    <td colSpan="2"></td>
                    <td>
                      <div className="asset-actions">
                        <button className="btn-save" onClick={handleSave}>Guardar</button>
                        <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
                      </div>
                    </td>
                  </>
                ) : (
                  // Modo visualización
                  <>
                    <td>{asset.name}</td>
                    <td>{asset.symbol}</td>
                    <td>
                      {asset.type === 'stock' && 'Acciones'}
                      {asset.type === 'crypto' && 'Criptomonedas'}
                      {asset.type === 'etf' && 'ETF'}
                      {asset.type === 'bond' && 'Bonos'}
                      {asset.type === 'commodity' && 'Materias Primas'}
                      {asset.type === 'other' && 'Otros'}
                    </td>
                    <td>{asset.quantity}</td>
                    <td>{formatCurrency(asset.purchasePrice)}</td>
                    <td>{formatCurrency(asset.currentPrice)}</td>
                    <td>{formatCurrency(asset.quantity * asset.currentPrice)}</td>
                    <td>
                      <div className={`profit-loss ${calculateProfitLoss(asset) >= 0 ? 'positive' : 'negative'}`}>
                        {formatCurrency(calculateProfitLoss(asset))}
                        <span className="percentage">
                          ({formatPercentage(calculateProfitLossPercentage(asset))})
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="asset-actions">
                        <button className="btn-edit" onClick={() => handleEdit(asset)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(asset.id)}>Eliminar</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetList; 