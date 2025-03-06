import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTradeJournal } from '../services/storageService';

// Crear el contexto
export const TradingContext = createContext();

// Hook personalizado para usar el contexto
export function useTrading() {
  return useContext(TradingContext);
}

export function TradingProvider({ children }) {
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    winRate: 0,
    totalProfit: 0,
    totalLoss: 0,
    netProfit: 0,
    averageProfit: 0,
    averageLoss: 0,
    profitFactor: 0,
    bestTrade: null,
    worstTrade: null,
    averageROI: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all'); // 'all', 'week', 'month', 'custom'
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });

  // Cargar operaciones del diario
  useEffect(() => {
    const loadTrades = async () => {
      try {
        setLoading(true);
        const journalTrades = await getTradeJournal();
        setTrades(journalTrades);
        setFilteredTrades(journalTrades);
        calculateMetrics(journalTrades);
      } catch (err) {
        console.error('Error al cargar operaciones para el dashboard:', err);
        setError('No se pudieron cargar los datos de operaciones.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTrades();
  }, []);

  // Filtrar operaciones por período
  useEffect(() => {
    if (!trades.length) return;
    
    let filtered = [...trades];
    const now = new Date();
    
    if (period === 'week') {
      // Filtrar últimos 7 días
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filtered = trades.filter(trade => new Date(trade.date) >= weekAgo);
    } else if (period === 'month') {
      // Filtrar último mes
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = trades.filter(trade => new Date(trade.date) >= monthAgo);
    } else if (period === 'custom' && dateRange.start && dateRange.end) {
      // Filtrar rango personalizado
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      filtered = trades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate >= start && tradeDate <= end;
      });
    }
    
    setFilteredTrades(filtered);
    calculateMetrics(filtered);
  }, [trades, period, dateRange]);

  // Calcular métricas basadas en las operaciones
  const calculateMetrics = (tradesData) => {
    if (!tradesData.length) {
      setMetrics({
        totalTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        averageProfit: 0,
        averageLoss: 0,
        profitFactor: 0,
        bestTrade: null,
        worstTrade: null,
        averageROI: 0
      });
      return;
    }
    
    // Filtrar operaciones cerradas (con resultado)
    const closedTrades = tradesData.filter(trade => 
      trade.status === 'ganada' || trade.status === 'perdida'
    );
    
    if (!closedTrades.length) {
      setMetrics({
        totalTrades: tradesData.length,
        pendingTrades: tradesData.length,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        averageProfit: 0,
        averageLoss: 0,
        profitFactor: 0,
        bestTrade: null,
        worstTrade: null,
        averageROI: 0
      });
      return;
    }
    
    // Calcular métricas
    const winningTrades = closedTrades.filter(trade => trade.status === 'ganada');
    const losingTrades = closedTrades.filter(trade => trade.status === 'perdida');
    
    const totalTrades = tradesData.length;
    const pendingTrades = tradesData.filter(trade => trade.status === 'pendiente').length;
    const completedTrades = closedTrades.length;
    const winRate = completedTrades > 0 ? (winningTrades.length / completedTrades) * 100 : 0;
    
    let totalProfit = 0;
    let totalLoss = 0;
    let bestTrade = null;
    let worstTrade = null;
    let totalROI = 0;
    
    // Calcular beneficios y pérdidas
    winningTrades.forEach(trade => {
      const profit = trade.actualProfit || 0;
      totalProfit += profit;
      
      if (!bestTrade || profit > (bestTrade.actualProfit || 0)) {
        bestTrade = trade;
      }
      
      if (trade.roi) {
        totalROI += trade.roi;
      }
    });
    
    losingTrades.forEach(trade => {
      const loss = trade.actualLoss || 0;
      totalLoss += loss;
      
      if (!worstTrade || loss > (worstTrade.actualLoss || 0)) {
        worstTrade = trade;
      }
      
      if (trade.roi) {
        totalROI += trade.roi;
      }
    });
    
    const netProfit = totalProfit - totalLoss;
    const averageProfit = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
    const averageROI = completedTrades > 0 ? totalROI / completedTrades : 0;
    
    setMetrics({
      totalTrades,
      pendingTrades,
      completedTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalProfit,
      totalLoss,
      netProfit,
      averageProfit,
      averageLoss,
      profitFactor,
      bestTrade,
      worstTrade,
      averageROI
    });
  };

  // Función para cambiar el período de filtrado
  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
  };
  
  // Función para establecer un rango de fechas personalizado
  const setCustomDateRange = (start, end) => {
    setDateRange({ start, end });
    setPeriod('custom');
  };

  // Análisis por par de trading
  const analyzeByTradingPair = () => {
    const pairStats = {};
    
    filteredTrades.forEach(trade => {
      if (!trade.symbol) return;
      
      if (!pairStats[trade.symbol]) {
        pairStats[trade.symbol] = {
          symbol: trade.symbol,
          trades: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          totalProfit: 0,
          totalLoss: 0,
          netProfit: 0,
          avgROI: 0,
          totalROI: 0
        };
      }
      
      const stats = pairStats[trade.symbol];
      stats.trades++;
      
      if (trade.status === 'ganada') {
        stats.wins++;
        stats.totalProfit += trade.actualProfit || 0;
      } else if (trade.status === 'perdida') {
        stats.losses++;
        stats.totalLoss += trade.actualLoss || 0;
      }
      
      stats.netProfit = stats.totalProfit - stats.totalLoss;
      stats.winRate = stats.wins > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0;
      
      if (trade.roi && (trade.status === 'ganada' || trade.status === 'perdida')) {
        stats.totalROI += trade.roi;
      }
    });
    
    // Calcular ROI promedio y ordenar resultados
    Object.values(pairStats).forEach(stats => {
      stats.avgROI = (stats.wins + stats.losses) > 0 ? 
        stats.totalROI / (stats.wins + stats.losses) : 0;
    });
    
    return Object.values(pairStats).sort((a, b) => b.netProfit - a.netProfit);
  };

  // Análisis por tipo (long/short)
  const analyzeByType = () => {
    const typeStats = {
      long: {
        type: 'long',
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        avgROI: 0,
        totalROI: 0
      },
      short: {
        type: 'short',
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        avgROI: 0,
        totalROI: 0
      },
      unknown: {
        type: 'desconocido',
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        avgROI: 0,
        totalROI: 0
      }
    };
    
    filteredTrades.forEach(trade => {
      // Si el tipo no es long o short, se considera desconocido
      const tradeType = trade.type && ['long', 'short'].includes(trade.type) 
                      ? trade.type 
                      : 'unknown';
      
      const stats = typeStats[tradeType];
      stats.trades++;
      
      if (trade.status === 'ganada') {
        stats.wins++;
        stats.totalProfit += trade.actualProfit || 0;
      } else if (trade.status === 'perdida') {
        stats.losses++;
        stats.totalLoss += trade.actualLoss || 0;
      }
      
      if (trade.roi && (trade.status === 'ganada' || trade.status === 'perdida')) {
        stats.totalROI += trade.roi;
      }
    });
    
    // Calcular métricas finales
    Object.values(typeStats).forEach(stats => {
      stats.netProfit = stats.totalProfit - stats.totalLoss;
      stats.winRate = (stats.wins + stats.losses) > 0 ? 
        (stats.wins / (stats.wins + stats.losses)) * 100 : 0;
      stats.avgROI = (stats.wins + stats.losses) > 0 ? 
        stats.totalROI / (stats.wins + stats.losses) : 0;
    });
    
    // Solo devolver los tipos que tengan al menos una operación
    return Object.values(typeStats).filter(stats => stats.trades > 0);
  };

  // Análisis por tipo de operación (scalp, swing, spot)
  const analyzeByOperationType = () => {
    const operationTypeStats = {
      scalp: {
        type: 'scalp',
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        avgROI: 0,
        totalROI: 0
      },
      swing: {
        type: 'swing',
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        avgROI: 0,
        totalROI: 0
      },
      spot: {
        type: 'spot',
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        avgROI: 0,
        totalROI: 0
      },
      unknown: {
        type: 'desconocido',
        trades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        avgROI: 0,
        totalROI: 0
      }
    };
    
    filteredTrades.forEach(trade => {
      // Si no hay operationType o no es válido, se considera desconocido
      const opType = trade.operationType && 
                    ['scalp', 'swing', 'spot'].includes(trade.operationType) 
                    ? trade.operationType 
                    : 'unknown';
      
      const stats = operationTypeStats[opType];
      
      stats.trades++;
      
      if (trade.status === 'ganada') {
        stats.wins++;
        stats.totalProfit += trade.actualProfit || 0;
      } else if (trade.status === 'perdida') {
        stats.losses++;
        stats.totalLoss += trade.actualLoss || 0;
      }
      
      if (trade.roi && (trade.status === 'ganada' || trade.status === 'perdida')) {
        stats.totalROI += trade.roi;
      }
    });
    
    // Calcular métricas finales
    Object.values(operationTypeStats).forEach(stats => {
      stats.netProfit = stats.totalProfit - stats.totalLoss;
      stats.winRate = (stats.wins + stats.losses) > 0 ? 
        (stats.wins / (stats.wins + stats.losses)) * 100 : 0;
      stats.avgROI = (stats.wins + stats.losses) > 0 ? 
        stats.totalROI / (stats.wins + stats.losses) : 0;
    });
    
    return Object.values(operationTypeStats);
  };

  // Análisis de rendimiento a lo largo del tiempo
  const analyzePerformanceOverTime = (interval = 'month') => {
    if (!filteredTrades.length) return [];
    
    const performanceByTime = {};
    
    filteredTrades.forEach(trade => {
      if (!trade.date) return;
      
      const date = new Date(trade.date);
      let timeKey;
      
      // Determinar la clave según el intervalo
      if (interval === 'day') {
        timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } else if (interval === 'week') {
        // Obtener el primer día de la semana
        const firstDayOfWeek = new Date(date);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        firstDayOfWeek.setDate(diff);
        timeKey = `${firstDayOfWeek.getFullYear()}-${String(firstDayOfWeek.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfWeek.getDate()).padStart(2, '0')}`;
      } else if (interval === 'month') {
        timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (interval === 'year') {
        timeKey = `${date.getFullYear()}`;
      }
      
      if (!timeKey) return;
      
      if (!performanceByTime[timeKey]) {
        performanceByTime[timeKey] = {
          time: timeKey,
          trades: 0,
          wins: 0,
          losses: 0,
          profit: 0,
          loss: 0,
          netProfit: 0,
          roi: 0,
          formattedTime: formatTimeLabel(timeKey, interval)
        };
      }
      
      const stats = performanceByTime[timeKey];
      stats.trades++;
      
      if (trade.status === 'ganada') {
        stats.wins++;
        stats.profit += trade.actualProfit || 0;
      } else if (trade.status === 'perdida') {
        stats.losses++;
        stats.loss += trade.actualLoss || 0;
      }
      
      stats.netProfit = stats.profit - stats.loss;
      
      if (trade.roi && (trade.status === 'ganada' || trade.status === 'perdida')) {
        stats.roi += trade.roi;
      }
    });
    
    // Convertir a array y ordenar cronológicamente
    return Object.values(performanceByTime).sort((a, b) => 
      a.time.localeCompare(b.time)
    );
  };

  // Formatea etiquetas de tiempo para mostrar en gráficos
  const formatTimeLabel = (timeKey, interval) => {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    if (interval === 'month') {
      const [year, month] = timeKey.split('-');
      return `${months[parseInt(month) - 1]} ${year}`;
    } else if (interval === 'year') {
      return timeKey;
    } else if (interval === 'day' || interval === 'week') {
      const [year, month, day] = timeKey.split('-');
      return `${day} ${months[parseInt(month) - 1]}`;
    }
    
    return timeKey;
  };

  const contextValue = {
    trades: filteredTrades,
    allTrades: trades,
    metrics,
    loading,
    error,
    period,
    dateRange,
    changePeriod,
    setCustomDateRange,
    analyzeByTradingPair,
    analyzeByType,
    analyzeByOperationType,
    analyzePerformanceOverTime
  };

  return (
    <TradingContext.Provider value={contextValue}>
      {children}
    </TradingContext.Provider>
  );
} 