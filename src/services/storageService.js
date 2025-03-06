import localforage from 'localforage';

// Configurar instancias para diferentes tipos de datos
const portfolioStore = localforage.createInstance({
  name: 'portfolio',
  storeName: 'portfolioData'
});

const calculatorStore = localforage.createInstance({
  name: 'calculator',
  storeName: 'calculatorData'
});

const tradesStore = localforage.createInstance({
  name: 'trades',
  storeName: 'tradesData'
});

// Métodos para el portfolio
export const savePortfolio = async (data) => {
  return portfolioStore.setItem('data', data);
};

export const getPortfolio = async () => {
  return portfolioStore.getItem('data');
};

// Métodos para la calculadora
export const saveCalculatorInputs = async (data) => {
  return calculatorStore.setItem('inputs', data);
};

export const getCalculatorInputs = async () => {
  return calculatorStore.getItem('inputs');
};

// Métodos para las operaciones
export const saveTrade = async (trade) => {
  const trades = await tradesStore.getItem('list') || [];
  trades.push(trade);
  return tradesStore.setItem('list', trades);
};

export const getAllTrades = async () => {
  return tradesStore.getItem('list') || [];
};

export const updateTrade = async (id, updatedTrade) => {
  const trades = await tradesStore.getItem('list') || [];
  const index = trades.findIndex(trade => trade.id === id);
  
  if (index !== -1) {
    trades[index] = { ...trades[index], ...updatedTrade };
    return tradesStore.setItem('list', trades);
  }
  
  return false;
};

export const deleteTrade = async (id) => {
  const trades = await tradesStore.getItem('list') || [];
  const filteredTrades = trades.filter(trade => trade.id !== id);
  
  return tradesStore.setItem('list', filteredTrades);
};

// Métodos para el diario de operaciones
export const getTradeJournal = () => {
  const trades = localStorage.getItem('tradeJournal');
  return trades ? JSON.parse(trades) : [];
};

export const saveTradeJournal = (trades) => {
  localStorage.setItem('tradeJournal', JSON.stringify(trades));
};

export const addTradeToJournal = (trade) => {
  const trades = getTradeJournal();
  // Generar un ID único para cada operación
  trade.id = Date.now().toString();
  // Asegurarnos de que la fecha esté en formato ISO
  if (!trade.date) {
    trade.date = new Date().toISOString();
  }
  // Estado inicial pendiente si no se especifica
  if (!trade.status) {
    trade.status = 'pendiente';
  }
  trades.push(trade);
  saveTradeJournal(trades);
  return trade;
};

export const updateTradeInJournal = (updatedTrade) => {
  const trades = getTradeJournal();
  const index = trades.findIndex(trade => trade.id === updatedTrade.id);
  
  if (index !== -1) {
    // Mantener la fecha original si no se proporciona una nueva
    if (!updatedTrade.date) {
      updatedTrade.date = trades[index].date;
    }
    
    // Si la operación se marca como ganada o perdida, calcular métricas adicionales
    if (updatedTrade.status === 'ganada' || updatedTrade.status === 'perdida') {
      // Asegurarnos de que actualProfit/actualLoss sean valores numéricos
      if (updatedTrade.status === 'ganada') {
        updatedTrade.actualProfit = parseFloat(updatedTrade.actualProfit) || 0;
        updatedTrade.actualLoss = 0;
      } else {
        updatedTrade.actualLoss = parseFloat(updatedTrade.actualLoss) || 0;
        updatedTrade.actualProfit = 0;
      }
      
      // Calcular ROI si tenemos el tamaño de posición
      if (updatedTrade.positionSize) {
        const positionSize = parseFloat(updatedTrade.positionSize);
        
        if (positionSize > 0) {
          if (updatedTrade.status === 'ganada') {
            updatedTrade.roi = (updatedTrade.actualProfit / positionSize) * 100;
          } else {
            updatedTrade.roi = -1 * (updatedTrade.actualLoss / positionSize) * 100;
          }
        }
      }
    }
    
    trades[index] = updatedTrade;
    saveTradeJournal(trades);
    return updatedTrade;
  }
  
  return null;
};

export const deleteTradeFromJournal = (tradeId) => {
  const trades = getTradeJournal();
  const filteredTrades = trades.filter(trade => trade.id !== tradeId);
  
  if (filteredTrades.length !== trades.length) {
    saveTradeJournal(filteredTrades);
    return true;
  }
  
  return false;
}; 