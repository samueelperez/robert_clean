import React, { useState, useEffect } from 'react';
import { getTradeJournal, updateTradeInJournal, deleteTradeFromJournal, saveTradeJournal } from '../services/storageService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaExclamationTriangle, FaArrowUp, FaArrowDown, FaExchangeAlt, FaThumbsUp, FaThumbsDown, FaPlus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import '../styles/TradeJournal.css';
import CryptoSelector from '../components/trading/CryptoSelector';
import CryptoLogo from '../components/portfolio/CryptoLogo';

const TradeJournalPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal de resultado
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState(null);
  const [resultAction, setResultAction] = useState('');
  const [customExitPrice, setCustomExitPrice] = useState('');
  
  // Modificar el estado para incluir el ID de la operación que se está editando inline
  const [inlineEditingTrade, setInlineEditingTrade] = useState(null);
  const [inlineEditValue, setInlineEditValue] = useState('');
  
  // Añadir estados para el modal de nueva operación
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    cryptoData: null,
    type: 'long',
    operationType: 'scalp', // Tipo de operación: scalp, swing o spot
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    positionSize: '',
    leverage: '1',
    notes: ''
  });
  
  useEffect(() => {
    const loadTrades = async () => {
      try {
        setLoading(true);
        const journalTrades = await getTradeJournal();
        setTrades(journalTrades);
      } catch (err) {
        console.error('Error al cargar el diario:', err);
        setError('No se pudieron cargar las operaciones. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTrades();
  }, []);
  
  // Función para abrir el modal de resultado
  const openResultModal = (tradeId, action) => {
    setSelectedTradeId(tradeId);
    setResultAction(action === 'win' ? 'ganada' : 'loss' ? 'perdida' : action);
    setCustomExitPrice('');
    setShowResultModal(true);
  };
  
  // Función para cerrar el modal de resultado
  const closeResultModal = () => {
    setShowResultModal(false);
    setSelectedTradeId(null);
    setResultAction('');
    setCustomExitPrice('');
  };
  
  // Función para procesar el resultado de la operación
  const processTradeResult = async (resultType) => {
    try {
      if (!selectedTradeId || !resultAction) return;
      
      const trade = trades.find(t => t.id === selectedTradeId);
      if (!trade) return;
      
      let updatedTrade = {
        ...trade,
        status: resultAction,
        resultType: resultType,
        exitDate: new Date().toISOString()
      };
      
      // Establecer precio de salida según el tipo de resultado
      if (resultType === 'takeProfit' && trade.takeProfit) {
        updatedTrade.exitPrice = trade.takeProfit;
      } else if (resultType === 'stopLoss' && trade.stopLoss) {
        updatedTrade.exitPrice = trade.stopLoss;
      } else if (resultType === 'otro') {
        if (!customExitPrice) {
          alert('Por favor, introduce un precio de salida.');
          return;
        }
        updatedTrade.exitPrice = customExitPrice;
      }
      
      // Calcular ganancia o pérdida
      const exitPrice = parseFloat(updatedTrade.exitPrice);
      const entryPrice = parseFloat(trade.entryPrice);
      const positionSize = parseFloat(trade.positionSize);
      const leverage = parseFloat(trade.leverage || 1);
      
      // Calcular resultado según tipo de operación (long/short)
      let pnl = 0;
      if (trade.type === 'long') {
        pnl = ((exitPrice - entryPrice) / entryPrice) * positionSize * leverage;
      } else {
        pnl = ((entryPrice - exitPrice) / entryPrice) * positionSize * leverage;
      }
      
      // Asignar a ganancia o pérdida según el signo
      if (pnl >= 0) {
        updatedTrade.actualProfit = pnl;
        updatedTrade.actualLoss = null;
        updatedTrade.status = 'ganada'; // Asegurar que el estado sea correcto
      } else {
        updatedTrade.actualLoss = Math.abs(pnl);
        updatedTrade.actualProfit = null;
        updatedTrade.status = 'perdida'; // Asegurar que el estado sea correcto
      }
      
      // Calcular ROI
      const investment = positionSize / leverage;
      updatedTrade.roi = (pnl / investment) * 100;
      
      // Guardar cambios
      await updateTradeInJournal(updatedTrade);
      
      // Actualizar la lista local
      setTrades(trades.map(t => 
        t.id === selectedTradeId ? { ...t, ...updatedTrade } : t
      ));
      
      // Cerrar el modal
      closeResultModal();
      
    } catch (err) {
      console.error('Error al procesar el resultado:', err);
      setError('No se pudo actualizar la operación. Por favor, intenta de nuevo.');
    }
  };
  
  const handleDeleteTrade = async (tradeId) => {
    try {
      setLoading(true);
      await deleteTradeFromJournal(tradeId);
      // Actualizar la lista de operaciones después de eliminar
      const updatedTrades = trades.filter(trade => trade.id !== tradeId);
      setTrades(updatedTrades);
      setLoading(false);
    } catch (error) {
      console.error('Error al eliminar la operación:', error);
      setError('No se pudo eliminar la operación. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };
  
  const getResultTypeIcon = (resultType, tradeType) => {
    switch (resultType) {
      case 'takeProfit':
        return <FaArrowUp className="result-icon take-profit" />;
      case 'stopLoss':
        return <FaArrowDown className="result-icon stop-loss" />;
      default:
        return <FaExchangeAlt className="result-icon other" />;
    }
  };
  
  const getResultTypeLabel = (resultType) => {
    switch (resultType) {
      case 'takeProfit':
        return 'Take Profit';
      case 'stopLoss':
        return 'Stop Loss';
      default:
        return 'Otro';
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha desconocida';
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'percent',
      signDisplay: 'exceptZero'
    }).format(value / 100);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'ganada':
        return 'status-win';
      case 'perdida':
        return 'status-loss';
      case 'cancelada':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
  // Función para iniciar la edición inline
  const startInlineEdit = (trade) => {
    setInlineEditingTrade(trade.id);
    setInlineEditValue(trade.symbol);
  };
  
  // Función para guardar la edición inline
  const saveInlineEdit = async (id) => {
    try {
      if (!inlineEditValue.trim()) {
        alert('Por favor, especifica el par de trading.');
        return;
      }
      
      // Buscar la operación completa
      const trade = trades.find(t => t.id === id);
      if (!trade) return;
      
      // Actualizar solo el símbolo
      const updatedTrade = {
        ...trade,
        symbol: inlineEditValue.trim()
      };
      
      await updateTradeInJournal(updatedTrade);
      
      // Actualizar la lista local
      setTrades(trades.map(trade => 
        trade.id === id ? { ...trade, symbol: inlineEditValue.trim() } : trade
      ));
      
      // Resetear el estado de edición
      setInlineEditingTrade(null);
      setInlineEditValue('');
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      setError('No se pudieron guardar los cambios. Por favor, intenta de nuevo.');
    }
  };
  
  // Función para cancelar la edición inline
  const cancelInlineEdit = () => {
    setInlineEditingTrade(null);
    setInlineEditValue('');
  };
  
  // Manejar teclas para guardar con Enter o cancelar con Escape
  const handleInlineEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveInlineEdit(id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelInlineEdit();
    }
  };
  
  // Función para abrir el modal de nueva operación
  const openAddModal = () => {
    setShowAddModal(true);
  };
  
  // Función para cerrar el modal de nueva operación
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewTrade({
      symbol: '',
      cryptoData: null,
      type: 'long',
      operationType: 'scalp',
      entryPrice: '',
      stopLoss: '',
      takeProfit: '',
      positionSize: '',
      leverage: '1',
      notes: ''
    });
  };
  
  // Función para manejar cambios en el formulario
  const handleNewTradeChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'operationType') {
      // Si cambia el tipo de operación, actualizar el leverage para spot
      const isSpot = value === 'spot';
      setNewTrade(prev => ({
        ...prev,
        [name]: value,
        leverage: isSpot ? '1' : prev.leverage // Reset leverage a 1 para spot
      }));
    } else {
      setNewTrade(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Función para manejar la selección de criptomoneda
  const handleCryptoSelect = (selectedCrypto) => {
    if (selectedCrypto) {
      setNewTrade(prev => ({
        ...prev,
        symbol: `${selectedCrypto.symbol}/USDT`,
        cryptoData: selectedCrypto
      }));
    } else {
      setNewTrade(prev => ({
        ...prev,
        symbol: '',
        cryptoData: null
      }));
    }
  };
  
  // Función para guardar la nueva operación
  const saveNewTrade = async () => {
    try {
      // Validar campos requeridos
      if (!newTrade.symbol || !newTrade.entryPrice || !newTrade.positionSize) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
      }
      
      // Ya no validamos el stopLoss como requerido
      
      // Crear objeto de operación
      const tradeData = {
        id: uuidv4(),
        date: new Date().toISOString(),
        symbol: newTrade.symbol,
        cryptoData: newTrade.cryptoData,
        type: newTrade.type,
        operationType: newTrade.operationType,
        entryPrice: parseFloat(newTrade.entryPrice),
        stopLoss: newTrade.stopLoss ? parseFloat(newTrade.stopLoss) : null,
        takeProfit: newTrade.takeProfit ? parseFloat(newTrade.takeProfit) : null,
        positionSize: parseFloat(newTrade.positionSize),
        leverage: newTrade.operationType === 'spot' ? 1 : parseFloat(newTrade.leverage),
        status: 'pendiente',
        notes: newTrade.notes
      };
      
      // Guardar en el diario
      await saveTradeJournal(tradeData);
      
      // Actualizar la lista local
      setTrades([tradeData, ...trades]);
      
      // Cerrar el modal
      closeAddModal();
      
    } catch (err) {
      console.error('Error al guardar la operación:', err);
      setError('No se pudo guardar la operación. Por favor, intenta de nuevo.');
    }
  };
  
  if (loading) {
    return <div className="loading">Cargando operaciones...</div>;
  }
  
  return (
    <div className="trade-journal-page">
      <div className="trade-journal-header">
        <h2>Diario de Operaciones</h2>
        <button className="add-trade-btn" onClick={openAddModal}>
          <FaPlus /> Añadir Operación
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {trades.length === 0 ? (
        <div className="empty-journal">
          <p>No hay operaciones registradas en el diario.</p>
          <p>Usa la calculadora de riesgo para planificar y guardar tus operaciones.</p>
        </div>
      ) : (
        <div className="trades-list">
          {trades.map(trade => (
            <div 
              key={trade.id} 
              className={`trade-card status-${trade.status === 'ganada' ? 'win' : trade.status === 'perdida' ? 'loss' : trade.status === 'cancelada' ? 'cancelled' : 'pending'}`}
            >
              <div className="trade-header">
                <div className="trade-symbol-container">
                  {/* Símbolo/Par de trading con edición inline */}
                  <div className="trade-symbol">
                    {inlineEditingTrade === trade.id ? (
                      <div className="inline-edit-container">
                        <input
                          type="text"
                          className="inline-edit-input"
                          value={inlineEditValue}
                          onChange={(e) => setInlineEditValue(e.target.value)}
                          onKeyDown={(e) => handleInlineEditKeyDown(e, trade.id)}
                          autoFocus
                        />
                        <div className="inline-edit-actions">
                          <button 
                            className="inline-save-btn" 
                            onClick={() => saveInlineEdit(trade.id)}
                            title="Guardar"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            className="inline-cancel-btn" 
                            onClick={cancelInlineEdit}
                            title="Cancelar"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <h3 
                        className={`trade-symbol-text ${!trade.symbol ? 'missing-symbol' : ''}`} 
                        onClick={() => startInlineEdit(trade)}
                        title="Haz clic para editar"
                      >
                        {trade.symbol ? (
                          <>
                            {/* Mostrar el logo si está disponible */}
                            {trade.cryptoData && (
                              <span className="trade-crypto-logo">
                                <CryptoLogo symbol={trade.cryptoData.symbol} name={trade.cryptoData.name} />
                              </span>
                            )}
                            {trade.symbol}
                            <span className="edit-hint"><FaEdit /></span>
                          </>
                        ) : (
                          <>
                            <FaExclamationTriangle className="warning-icon" /> Sin par de trading
                            <span className="edit-hint"><FaEdit /></span>
                          </>
                        )}
                      </h3>
                    )}
                  </div>
                  <span className={`trade-type ${trade.type}`}>
                    {trade.type === 'long' ? 'LONG' : 'SHORT'}
                    {trade.operationType && (
                      <span className={`operation-type-label ${trade.operationType}`}>
                        {trade.operationType === 'scalp' ? 'Scalp' : 
                         trade.operationType === 'swing' ? 'Swing' : 'Spot'}
                      </span>
                    )}
                  </span>
                </div>
                <div className="trade-actions">
                  <button 
                    className="delete-trade-btn" 
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que deseas eliminar esta operación?')) {
                        handleDeleteTrade(trade.id);
                      }
                    }}
                    title="Eliminar operación"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="trade-details">
                <div className="trade-detail">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">{formatDate(trade.date)}</span>
                </div>
                
                <div className="trade-detail">
                  <span className="detail-label">Entrada:</span>
                  <span className="detail-value">{trade.entryPrice} USDT</span>
                </div>
                
                <div className="trade-detail">
                  <span className="detail-label">Stop Loss:</span>
                  <span className="detail-value">{trade.stopLoss} USDT</span>
                </div>
                
                {trade.takeProfit && (
                  <div className="trade-detail">
                    <span className="detail-label">Take Profit:</span>
                    <span className="detail-value">{trade.takeProfit} USDT</span>
                  </div>
                )}
                
                <div className="trade-detail">
                  <span className="detail-label">Tamaño:</span>
                  <span className="detail-value">{trade.positionSize} USDT</span>
                </div>
                
                {trade.leverage && (
                  <div className="trade-detail">
                    <span className="detail-label">Apalancamiento:</span>
                    <span className="detail-value">{trade.leverage}x</span>
                  </div>
                )}
                
                <div className="trade-detail">
                  <span className="detail-label">Estado:</span>
                  <span className={`detail-value status ${getStatusClass(trade.status)}`}>
                    {trade.status === 'ganada' ? 'Ganada' : 
                     trade.status === 'perdida' ? 'Perdida' : 
                     trade.status === 'cancelada' ? 'Cancelada' : 'Pendiente'}
                  </span>
                </div>
                
                {trade.exitPrice && (
                  <div className="trade-detail">
                    <span className="detail-label">Precio de Salida:</span>
                    <span className="detail-value">{trade.exitPrice} USDT</span>
                  </div>
                )}
                
                {trade.resultType && trade.status !== 'pendiente' && (
                  <div className="trade-detail">
                    <span className="detail-label">Resultado:</span>
                    <span className={`detail-value result-type ${trade.resultType}`}>
                      {getResultTypeIcon(trade.resultType, trade.type)} {getResultTypeLabel(trade.resultType)}
                    </span>
                  </div>
                )}
                
                {(trade.actualProfit || trade.actualLoss) && (
                  <>
                    <div className="trade-detail">
                      <span className="detail-label">P/L:</span>
                      <span className={`detail-value ${trade.actualProfit ? 'profit' : 'loss'}`}>
                        {trade.actualProfit ? 
                          `+${formatCurrency(trade.actualProfit)} USDT` : 
                          `-${formatCurrency(trade.actualLoss)} USDT`}
                      </span>
                    </div>
                    
                    {trade.roi && (
                      <div className="trade-detail">
                        <span className="detail-label">ROI:</span>
                        <span className={`detail-value ${trade.roi >= 0 ? 'profit' : 'loss'}`}>
                          {formatPercentage(trade.roi)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {trade.notes && (
                <div className="trade-notes">
                  <h4>Notas:</h4>
                  <p>{trade.notes}</p>
                </div>
              )}
              
              {/* Botones de acción rápida para operaciones pendientes */}
              {trade.status === 'pendiente' && (
                <div className="trade-result-buttons">
                  <button 
                    className="result-btn win-btn" 
                    onClick={() => openResultModal(trade.id, 'win')}
                  >
                    <FaThumbsUp /> Ganada
                  </button>
                  <button 
                    className="result-btn loss-btn" 
                    onClick={() => openResultModal(trade.id, 'loss')}
                  >
                    <FaThumbsDown /> Perdida
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Modal para seleccionar tipo de resultado */}
      {showResultModal && (
        <div className="modal-overlay">
          <div className="result-modal">
            <h3>
              {resultAction === 'ganada' ? 'Operación Ganada' : 'Operación Perdida'}
            </h3>
            
            <div className="modal-content">
              <p>Selecciona el tipo de resultado:</p>
              
              <div className="result-options">
                <button 
                  className="result-option"
                  onClick={() => processTradeResult(resultAction === 'ganada' ? 'takeProfit' : 'stopLoss')}
                >
                  {resultAction === 'ganada' ? (
                    <>
                      <FaArrowUp className="result-icon take-profit" />
                      <span>Take Profit</span>
                    </>
                  ) : (
                    <>
                      <FaArrowDown className="result-icon stop-loss" />
                      <span>Stop Loss</span>
                    </>
                  )}
                </button>
                
                <div className="result-option-divider">o</div>
                
                <div className="result-option custom">
                  <div className="custom-price-input">
                    <label htmlFor="customExitPrice">Precio de salida personalizado:</label>
                    <input
                      type="number"
                      id="customExitPrice"
                      value={customExitPrice}
                      onChange={(e) => setCustomExitPrice(e.target.value)}
                      placeholder="Ej: 45000.50"
                      step="0.01"
                    />
                  </div>
                  
                  <button 
                    className="apply-custom-price"
                    onClick={() => processTradeResult('otro')}
                    disabled={!customExitPrice}
                  >
                    <FaCheck /> Aplicar precio personalizado
                  </button>
                </div>
              </div>
            </div>
            
            <button className="close-modal" onClick={closeResultModal}>
              <FaTimes /> Cancelar
            </button>
          </div>
        </div>
      )}
      
      {/* Modal para añadir nueva operación */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-trade-modal">
            <h3>Añadir Nueva Operación</h3>
            
            <div className="add-trade-form">
              <div className="form-row">
                <div className="form-group symbol-selector">
                  <CryptoSelector 
                    onSelect={handleCryptoSelect} 
                    label="Par de Trading" 
                    placeholder="Buscar criptomoneda..."
                  />
                  {newTrade.symbol && (
                    <div className="selected-pair">
                      <span>Par seleccionado: <strong>{newTrade.symbol}</strong></span>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Dirección</label>
                  <select
                    id="type"
                    name="type"
                    value={newTrade.type}
                    onChange={handleNewTradeChange}
                  >
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="operationType">Tipo de Operación</label>
                  <select
                    id="operationType"
                    name="operationType"
                    value={newTrade.operationType}
                    onChange={handleNewTradeChange}
                  >
                    <option value="scalp">Scalp</option>
                    <option value="swing">Swing</option>
                    <option value="spot">Spot</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="entryPrice">Precio de Entrada</label>
                  <input
                    type="number"
                    id="entryPrice"
                    name="entryPrice"
                    value={newTrade.entryPrice}
                    onChange={handleNewTradeChange}
                    placeholder="Ej: 45000.50"
                    step="0.01"
                    required
                  />
                </div>
                
                {/* Mostrar Stop Loss solo si no es spot */}
                {newTrade.operationType !== 'spot' && (
                  <div className="form-group">
                    <label htmlFor="stopLoss">
                      Stop Loss <span className="optional-label">(Opcional)</span>
                    </label>
                    <input
                      type="number"
                      id="stopLoss"
                      name="stopLoss"
                      value={newTrade.stopLoss}
                      onChange={handleNewTradeChange}
                      placeholder="Ej: 44000.00"
                      step="0.01"
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="takeProfit">Take Profit (opcional)</label>
                  <input
                    type="number"
                    id="takeProfit"
                    name="takeProfit"
                    value={newTrade.takeProfit}
                    onChange={handleNewTradeChange}
                    placeholder="Ej: 48000.00"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="positionSize">Tamaño de Posición</label>
                  <input
                    type="number"
                    id="positionSize"
                    name="positionSize"
                    value={newTrade.positionSize}
                    onChange={handleNewTradeChange}
                    placeholder="Ej: 1000"
                    step="0.01"
                    required
                  />
                </div>
                
                {/* Mostrar apalancamiento solo si no es spot */}
                {newTrade.operationType !== 'spot' && (
                  <div className="form-group">
                    <label htmlFor="leverage">Apalancamiento</label>
                    <input
                      type="number"
                      id="leverage"
                      name="leverage"
                      value={newTrade.leverage}
                      onChange={handleNewTradeChange}
                      placeholder="Ej: 5"
                      min="1"
                      step="1"
                    />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notas (opcional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newTrade.notes}
                  onChange={handleNewTradeChange}
                  placeholder="Añade notas sobre tu estrategia o razones para esta operación..."
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="save-trade-btn" onClick={saveNewTrade}>
                <FaCheck /> Guardar Operación
              </button>
              <button className="cancel-btn" onClick={closeAddModal}>
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeJournalPage; 