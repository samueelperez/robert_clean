import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { FaInfoCircle, FaExchangeAlt, FaSave, FaCheck } from 'react-icons/fa';
import { saveCalculatorInputs, getCalculatorInputs, saveTradeJournal } from '../services/storageService';
import '../styles/RiskCalculator.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { symbolToId, getCurrentPrice } from '../services/cryptoService';
import ApiStatus from '../components/ApiStatus';

const RiskCalculator = () => {
  const { totalValue, getPrice } = usePortfolio();
  const navigate = useNavigate();
  
  // Estado para almacenar los valores de entrada
  const [inputs, setInputs] = useState({
    portfolioSize: '',
    entryPrice: '',
    stopLossPrice: '',
    operationType: 'long',
    takeProfitPrice: '',
    riskPercentage: '1', // Valor por defecto: 1%
    symbol: ''
  });

  // Estado para almacenar los resultados
  const [results, setResults] = useState(null);
  
  // Estado para mensajes de error
  const [error, setError] = useState('');
  
  // Estado para almacenar valores de cálculo para la explicación
  const [calculationDetails, setCalculationDetails] = useState({
    portfolio: 0,
    priceDifference: 0,
    riskPercentage: 0,
    portfolioRiskPercentage: 0
  });
  
  // Estado para controlar si el tipo de operación está en modo automático
  const [autoDetectOperationType, setAutoDetectOperationType] = useState(true);
  
  // Estado para controlar si la operación se ha guardado
  const [tradeSaved, setTradeSaved] = useState(false);

  // Añadir estado para el apalancamiento seleccionado
  const [selectedLeverage, setSelectedLeverage] = useState(null);

  // Añadir estado para el precio actual
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const loadSavedInputs = async () => {
      try {
        const savedInputs = await getCalculatorInputs();
        if (savedInputs) {
          setInputs(savedInputs);
          // Si hay valores guardados para entrada y stop loss, determinar si autodetect debería estar activo
          if (savedInputs.entryPrice && savedInputs.stopLossPrice) {
            setAutoDetectOperationType(false);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    };
    
    loadSavedInputs();
  }, []);

  // Actualizar el tamaño del portfolio cuando cambia el valor total
  useEffect(() => {
    if (totalValue > 0) {
      setInputs(prev => ({
        ...prev,
        portfolioSize: totalValue.toString()
      }));
      
      // Guardar el nuevo valor en localForage
      saveCalculatorInputs({
        ...inputs,
        portfolioSize: totalValue.toString()
      }).catch(error => {
        console.error('Error al guardar inputs:', error);
      });
    }
  }, [totalValue]);
  
  // Detectar automáticamente el tipo de operación cuando cambian los precios
  useEffect(() => {
    if (autoDetectOperationType && inputs.entryPrice && inputs.stopLossPrice) {
      const entryPrice = parseFloat(inputs.entryPrice);
      const stopLossPrice = parseFloat(inputs.stopLossPrice);
      
      if (!isNaN(entryPrice) && !isNaN(stopLossPrice)) {
        const newOperationType = stopLossPrice < entryPrice ? 'long' : 'short';
        
        if (newOperationType !== inputs.operationType) {
          const newInputs = {
            ...inputs,
            operationType: newOperationType
          };
          
          setInputs(newInputs);
          
          // Guardar en localForage
          saveCalculatorInputs(newInputs).catch(error => {
            console.error('Error al guardar inputs:', error);
          });
        }
      }
    }
  }, [inputs.entryPrice, inputs.stopLossPrice, autoDetectOperationType]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newInputs = {
      ...inputs,
      [name]: value
    };
    
    // Si el usuario cambia manualmente el tipo de operación, desactivar la detección automática
    if (name === 'operationType') {
      setAutoDetectOperationType(false);
    }
    
    setInputs(newInputs);
    
    // Guardar en localForage
    saveCalculatorInputs(newInputs).catch(error => {
      console.error('Error al guardar inputs:', error);
    });
    
    // Limpiar errores cuando el usuario modifica los inputs
    setError('');
    setResults(null);
    setTradeSaved(false);
  };
  
  // Alternar entre detección automática y manual del tipo de operación
  const toggleAutoDetect = () => {
    const newAutoDetect = !autoDetectOperationType;
    setAutoDetectOperationType(newAutoDetect);
    
    // Si se activa la detección automática y hay precios, actualizar el tipo de operación
    if (newAutoDetect && inputs.entryPrice && inputs.stopLossPrice) {
      const entryPrice = parseFloat(inputs.entryPrice);
      const stopLossPrice = parseFloat(inputs.stopLossPrice);
      
      if (!isNaN(entryPrice) && !isNaN(stopLossPrice)) {
        const newOperationType = stopLossPrice < entryPrice ? 'long' : 'short';
        
        if (newOperationType !== inputs.operationType) {
          const newInputs = {
            ...inputs,
            operationType: newOperationType
          };
          
          setInputs(newInputs);
          
          // Guardar en localForage
          saveCalculatorInputs(newInputs).catch(error => {
            console.error('Error al guardar inputs:', error);
          });
        }
      }
    }
  };

  // Calcular la posición
  const calculatePosition = () => {
    // Validar inputs
    if (!inputs.portfolioSize || !inputs.entryPrice || !inputs.stopLossPrice || !inputs.riskPercentage) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    const portfolioSize = parseFloat(inputs.portfolioSize);
    const entryPrice = parseFloat(inputs.entryPrice);
    const stopLossPrice = parseFloat(inputs.stopLossPrice);
    const takeProfitPrice = inputs.takeProfitPrice ? parseFloat(inputs.takeProfitPrice) : null;
    const riskPercentage = parseFloat(inputs.riskPercentage);
    
    if (isNaN(portfolioSize) || isNaN(entryPrice) || isNaN(stopLossPrice) || isNaN(riskPercentage)) {
      setError('Por favor, ingresa valores numéricos válidos.');
      return;
    }
    
    if (portfolioSize <= 0 || entryPrice <= 0 || stopLossPrice <= 0 || riskPercentage <= 0) {
      setError('Todos los valores deben ser mayores que cero.');
      return;
    }
    
    // Validar que el stop loss sea coherente con el tipo de operación
    if (inputs.operationType === 'long' && stopLossPrice >= entryPrice) {
      setError('Para operaciones LONG, el stop loss debe ser menor que el precio de entrada.');
      return;
    }
    
    if (inputs.operationType === 'short' && stopLossPrice <= entryPrice) {
      setError('Para operaciones SHORT, el stop loss debe ser mayor que el precio de entrada.');
      return;
    }
    
    // Validar take profit si se proporciona
    if (takeProfitPrice !== null) {
      if (inputs.operationType === 'long' && takeProfitPrice <= entryPrice) {
        setError('Para operaciones LONG, el take profit debe ser mayor que el precio de entrada.');
        return;
      }
      
      if (inputs.operationType === 'short' && takeProfitPrice >= entryPrice) {
        setError('Para operaciones SHORT, el take profit debe ser menor que el precio de entrada.');
        return;
      }
    }
    
    // Calcular el riesgo máximo en USDT
    const maxRisk = portfolioSize * (riskPercentage / 100);
    
    // Calcular la diferencia de precio entre entrada y stop loss
    let priceDifference, riskPercentagePrice;
    
    if (inputs.operationType === 'long') {
      priceDifference = entryPrice - stopLossPrice;
      riskPercentagePrice = priceDifference / entryPrice;
    } else { // short
      priceDifference = stopLossPrice - entryPrice;
      riskPercentagePrice = priceDifference / entryPrice;
    }
    
    // Calcular el tamaño de la posición
    const positionSize = maxRisk / riskPercentagePrice;
    
    // Calcular el beneficio potencial si hay take profit
    let potentialProfit = 0;
    let potentialProfitPercentage = 0;
    
    if (takeProfitPrice) {
      if (inputs.operationType === 'long') {
        potentialProfit = (takeProfitPrice - entryPrice) * (positionSize / entryPrice);
        potentialProfitPercentage = ((takeProfitPrice - entryPrice) / entryPrice) * 100;
      } else {
        potentialProfit = (entryPrice - takeProfitPrice) * (positionSize / entryPrice);
        potentialProfitPercentage = ((entryPrice - takeProfitPrice) / entryPrice) * 100;
      }
    }
    
    // Calcular ratio riesgo/recompensa si se proporciona take profit
    let riskRewardRatio = null;
    if (takeProfitPrice !== null) {
      let reward;
      if (inputs.operationType === 'long') {
        reward = takeProfitPrice - entryPrice;
      } else { // short
        reward = entryPrice - takeProfitPrice;
      }
      
      riskRewardRatio = reward / priceDifference;
    }
    
    // Calcular opciones de apalancamiento (cambiar 1x por 50x)
    const leverageOptions = [5, 10, 20, 50].map(leverage => {
      const actualInvestment = positionSize / leverage;
      return {
        leverage,
        actualInvestment,
        portfolioPercentage: (actualInvestment / portfolioSize) * 100
      };
    });
    
    // Establecer resultados
    setResults({
      positionSize,
      maxRisk,
      leverageOptions,
      potentialProfit,
      potentialProfitPercentage
    });
    
    // Guardar detalles del cálculo para la explicación
    setCalculationDetails({
      portfolio: portfolioSize,
      priceDifference,
      riskPercentage: riskPercentagePrice,
      portfolioRiskPercentage: riskPercentage
    });
    
    // Resetear el estado de guardado
    setTradeSaved(false);
  };
  
  // Función para seleccionar un apalancamiento
  const selectLeverage = (leverage) => {
    setSelectedLeverage(leverage);
  };

  // Modificar la función de guardar operación para usar el apalancamiento seleccionado
  const saveTrade = async () => {
    if (!results) return;
    
    // Verificar si se ha seleccionado un apalancamiento
    if (!selectedLeverage) {
      alert('Por favor, selecciona una opción de apalancamiento antes de guardar.');
      return;
    }
    
    const tradeData = {
      id: uuidv4(),
      date: new Date().toISOString(),
      symbol: inputs.symbol || 'UNKNOWN',
      type: inputs.operationType,
      entryPrice: parseFloat(inputs.entryPrice),
      stopLoss: parseFloat(inputs.stopLossPrice),
      takeProfit: inputs.takeProfitPrice ? parseFloat(inputs.takeProfitPrice) : null,
      positionSize: results.positionSize,
      leverage: selectedLeverage.leverage, // Usar el apalancamiento seleccionado
      maxRisk: results.maxRisk,
      riskPercentage: parseFloat(inputs.riskPercentage),
      status: 'pendiente',
      notes: inputs.notes || ''
    };
    
    try {
      // Guardar en el diario
      await saveTradeJournal(tradeData);
      
      // Actualizar estado
      setTradeSaved(true);
      
      // Opcional: redirigir al diario después de un tiempo
      setTimeout(() => {
        navigate('/diario');
      }, 2000);
    } catch (error) {
      console.error('Error al guardar la operación:', error);
      setError('No se pudo guardar la operación en el diario. Por favor, intenta de nuevo.');
    }
  };

  // Función para buscar el precio actual
  const fetchCurrentPrice = async (symbol) => {
    if (!symbol) return;
    
    try {
      setLoadingPrice(true);
      const price = await getPrice(symbol);
      if (price) {
        setCurrentPrice(price);
        // Actualizar el precio de entrada si está vacío
        if (!inputs.entryPrice) {
          setInputs(prev => ({
            ...prev,
            entryPrice: price.toString()
          }));
        }
      }
    } catch (error) {
      console.error('Error al obtener precio:', error);
    } finally {
      setLoadingPrice(false);
    }
  };
  
  // Buscar precio cuando cambia el símbolo
  useEffect(() => {
    if (inputs.symbol) {
      fetchCurrentPrice(inputs.symbol);
    }
  }, [inputs.symbol]);

  return (
    <div className="risk-calculator">
      <h2>Calculadora de Riesgo</h2>
      <p className="calculator-description">
        Esta calculadora te ayuda a determinar el tamaño óptimo de posición basado en tu gestión de riesgo.
      </p>
      
      <ApiStatus />
      
      <form className="calculator-form">
        <div className="form-group">
          <label htmlFor="portfolioSize">Tamaño del Portfolio (USDT)</label>
          <input
            type="number"
            id="portfolioSize"
            name="portfolioSize"
            value={inputs.portfolioSize}
            onChange={handleInputChange}
            placeholder="Ej: 10000"
            min="0"
            step="any"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="entryPrice">Precio de Entrada (USDT)</label>
          <input
            type="number"
            id="entryPrice"
            name="entryPrice"
            value={inputs.entryPrice}
            onChange={handleInputChange}
            placeholder="Ej: 50000"
            min="0"
            step="any"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stopLossPrice">Precio de Stop Loss (USDT)</label>
          <input
            type="number"
            id="stopLossPrice"
            name="stopLossPrice"
            value={inputs.stopLossPrice}
            onChange={handleInputChange}
            placeholder={inputs.operationType === 'long' ? "Menor que el precio de entrada" : "Mayor que el precio de entrada"}
            min="0"
            step="any"
          />
        </div>
        
        <div className="form-group operation-type-group">
          <label htmlFor="operationType">
            Tipo de Operación
            <button 
              type="button" 
              className={`auto-detect-toggle ${autoDetectOperationType ? 'active' : ''}`}
              onClick={toggleAutoDetect}
            >
              <FaExchangeAlt className="toggle-icon" />
              {autoDetectOperationType ? 'Auto' : 'Manual'}
            </button>
          </label>
          <select
            id="operationType"
            name="operationType"
            value={inputs.operationType}
            onChange={handleInputChange}
            disabled={autoDetectOperationType}
            className={autoDetectOperationType ? 'auto-detected' : ''}
          >
            <option value="long">LONG (Compra)</option>
            <option value="short">SHORT (Venta)</option>
          </select>
          {autoDetectOperationType && (
            <div className="auto-detect-info">
              <FaInfoCircle className="info-icon" />
              <span>Tipo de operación detectado automáticamente según el stop loss</span>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="takeProfitPrice">Precio de Take Profit (USDT) (Opcional)</label>
          <input
            type="number"
            id="takeProfitPrice"
            name="takeProfitPrice"
            value={inputs.takeProfitPrice}
            onChange={handleInputChange}
            placeholder={inputs.operationType === 'long' ? "Mayor que el precio de entrada" : "Menor que el precio de entrada"}
            min="0"
            step="any"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="riskPercentage">Porcentaje de Riesgo (%)</label>
          <input
            type="number"
            id="riskPercentage"
            name="riskPercentage"
            value={inputs.riskPercentage}
            onChange={handleInputChange}
            placeholder="Ej: 1"
            min="0.1"
            max="10"
            step="0.1"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="symbol">Par de Trading</label>
          <div className="symbol-input-container">
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={inputs.symbol}
              onChange={handleInputChange}
              placeholder="Ej: BTC/USDT"
            />
            {inputs.symbol && (
              <button 
                className="get-price-btn" 
                onClick={() => fetchCurrentPrice(inputs.symbol)}
                disabled={loadingPrice}
              >
                {loadingPrice ? 'Cargando...' : 'Obtener Precio'}
              </button>
            )}
          </div>
          {currentPrice && (
            <div className="current-price-info">
              Precio actual: <span className="price-value">${currentPrice.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <button 
          type="button" 
          className="calculate-button"
          onClick={calculatePosition}
        >
          Calcular Posición
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {results && (
        <div className="calculation-results">
          <h3>Resultados del Cálculo</h3>
          
          <div className="results-summary">
            <div className="result-item">
              <span className="result-label">Tamaño de Posición:</span>
              <span className="result-value">{results.positionSize.toFixed(2)} USDT</span>
            </div>
            
            <div className="result-item">
              <span className="result-label">Riesgo Máximo:</span>
              <span className="result-value">{results.maxRisk.toFixed(2)} USDT ({inputs.riskPercentage}%)</span>
            </div>
            
            {results.potentialProfit > 0 && (
              <div className="result-item profit-highlight">
                <span className="result-label">Beneficio Potencial:</span>
                <span className="result-value">{results.potentialProfit.toFixed(2)} USDT ({results.potentialProfitPercentage.toFixed(2)}%)</span>
              </div>
            )}
          </div>
          
          <h4 className="leverage-options-title">Opciones de Apalancamiento:</h4>
          <div className="leverage-options">
            {results.leverageOptions.map(option => (
              <div 
                key={option.leverage} 
                className={`leverage-option ${selectedLeverage && selectedLeverage.leverage === option.leverage ? 'selected' : ''}`}
                onClick={() => selectLeverage(option)}
              >
                <div className="leverage-option-header">
                  <span>Apalancamiento</span>
                  <span className="leverage-value">{option.leverage}x</span>
                </div>
                <div className="leverage-details">
                  <div className="leverage-detail">
                    <span className="detail-label">Inversión Real:</span>
                    <span className="detail-value">{option.actualInvestment.toFixed(2)} USDT</span>
                  </div>
                  <div className="leverage-detail">
                    <span className="detail-label">% del Portfolio:</span>
                    <span className="detail-value">{option.portfolioPercentage.toFixed(2)}%</span>
                  </div>
                  {results.potentialProfit > 0 && (
                    <div className="leverage-detail potential-profit">
                      <span className="detail-label">Beneficio Potencial:</span>
                      <span className="detail-value">
                        {(results.potentialProfit * option.leverage).toFixed(2)} USDT
                        ({(results.potentialProfitPercentage * option.leverage).toFixed(2)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className={`save-trade-button ${tradeSaved ? 'saved' : ''}`}
            onClick={saveTrade}
            disabled={tradeSaved}
          >
            {tradeSaved ? (
              <>
                <FaCheck className="save-icon" />
                Operación Guardada
              </>
            ) : (
              <>
                <FaSave className="save-icon" />
                Guardar en Diario
              </>
            )}
          </button>
          
          <div className="calculation-explanation">
            <h4>Explicación del cálculo:</h4>
            <p>
              • Riesgo máximo: {inputs.riskPercentage}% de tu portfolio ({results.maxRisk.toFixed(2)} USDT)<br/>
              • Diferencia entre entrada y stop loss: {calculationDetails.priceDifference.toFixed(2)} USDT ({(calculationDetails.riskPercentage * 100).toFixed(2)}%)<br/>
              • Tamaño de posición: Riesgo máximo ÷ Porcentaje de riesgo = {results.positionSize.toFixed(2)} USDT<br/>
              • Para cada opción de apalancamiento, la inversión real se calcula como: Tamaño de posición ÷ Apalancamiento
            </p>
            <p className="risk-note">
              <strong>Nota importante:</strong> A mayor apalancamiento, menor capital necesario pero mayor riesgo de liquidación. 
              Asegúrate de entender los riesgos antes de operar con apalancamiento elevado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskCalculator;