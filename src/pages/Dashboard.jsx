import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, FaCalendarAlt, FaExchangeAlt, FaChartPie, 
  FaArrowUp, FaArrowDown, FaEllipsisH, FaPlus, FaFilter,
  FaRegClock, FaRegLightbulb, FaRegChartBar
} from 'react-icons/fa';
import { useTrading } from '../contexts/TradingContext';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { 
    trades, 
    metrics, 
    loading, 
    error, 
    period, 
    changePeriod, 
    setCustomDateRange,
    analyzeByTradingPair,
    analyzeByType,
    analyzeByOperationType,
    analyzePerformanceOverTime
  } = useTrading();

  const [activeTab, setActiveTab] = useState('overview');
  const [performanceInterval, setPerformanceInterval] = useState('month');
  const [pairData, setPairData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [operationTypeData, setOperationTypeData] = useState([]);
  const [timePerformance, setTimePerformance] = useState([]);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Colores para gráficos
  const COLORS = ['#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
  const PROFIT_COLOR = '#10b981';
  const LOSS_COLOR = '#ef4444';

  useEffect(() => {
    if (!loading && !error) {
      // Preparar datos para los gráficos cuando los trades estén cargados
      setPairData(analyzeByTradingPair());
      setTypeData(analyzeByType());
      setOperationTypeData(analyzeByOperationType());
      setTimePerformance(analyzePerformanceOverTime(performanceInterval));
    }
  }, [loading, error, trades, period, performanceInterval]);

  // Función para aplicar un rango de fechas personalizado
  const applyCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      setCustomDateRange(customStartDate, customEndDate);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Tooltip personalizado para gráficos
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-profit" style={{ color: payload[0].value >= 0 ? PROFIT_COLOR : LOSS_COLOR }}>
            {`Beneficio: ${formatCurrency(payload[0].value)}`}
          </p>
          {payload[1] && <p className="tooltip-trades">{`Operaciones: ${payload[1].value}`}</p>}
        </div>
      );
    }
    return null;
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos de operaciones...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h2>Error al cargar datos</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Resumen de tu actividad de trading</p>
        </div>
        <div className="dashboard-actions">
          <div className="timeframe-selector">
            <button 
              className={period === 'all' ? 'active' : ''} 
              onClick={() => changePeriod('all')}
            >
              Todo
            </button>
            <button 
              className={period === 'month' ? 'active' : ''} 
              onClick={() => changePeriod('month')}
            >
              Mes
            </button>
            <button 
              className={period === 'week' ? 'active' : ''} 
              onClick={() => changePeriod('week')}
            >
              Semana
            </button>
            <button 
              className={period === 'custom' ? 'active' : ''} 
              onClick={() => changePeriod('custom')}
            >
              Personalizado
            </button>
          </div>
          <Link to="/tradejournal" className="add-trade-button">
            <FaPlus /> Nueva Operación
          </Link>
        </div>
      </div>

      {/* Selector de fecha personalizada */}
      {period === 'custom' && (
        <div className="custom-date-range">
          <div className="date-inputs">
            <div className="date-input-group">
              <label>Desde:</label>
              <input 
                type="date" 
                value={customStartDate} 
                onChange={(e) => setCustomStartDate(e.target.value)} 
              />
            </div>
            <div className="date-input-group">
              <label>Hasta:</label>
              <input 
                type="date" 
                value={customEndDate} 
                onChange={(e) => setCustomEndDate(e.target.value)} 
              />
            </div>
          </div>
          <button 
            className="apply-date-button"
            onClick={applyCustomDateRange}
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Navegación de pestañas */}
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Resumen
        </button>
        <button 
          className={activeTab === 'pairs' ? 'active' : ''} 
          onClick={() => setActiveTab('pairs')}
        >
          Por Par
        </button>
        <button 
          className={activeTab === 'types' ? 'active' : ''} 
          onClick={() => setActiveTab('types')}
        >
          Por Tipo
        </button>
        <button 
          className={activeTab === 'time' ? 'active' : ''} 
          onClick={() => setActiveTab('time')}
        >
          Temporal
        </button>
      </div>

      {/* Contenido de pestaña actual */}
      <div className="dashboard-content">
        {/* Pestaña de Resumen */}
        {activeTab === 'overview' && (
          <>
            {/* Tarjetas de estadísticas */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon profit">
                  <FaChartLine />
                </div>
                <div className="stat-content">
                  <h3>Beneficio Total</h3>
                  <p className={metrics.netProfit >= 0 ? 'profit-value' : 'loss-value'}>
                    {formatCurrency(metrics.netProfit)}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon trades">
                  <FaExchangeAlt />
                </div>
                <div className="stat-content">
                  <h3>Operaciones</h3>
                  <p>{metrics.totalTrades}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon win-rate">
                  <FaChartPie />
                </div>
                <div className="stat-content">
                  <h3>Ratio de Éxito</h3>
                  <p>{formatPercentage(metrics.winRate)}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon avg-profit">
                  <FaRegChartBar />
                </div>
                <div className="stat-content">
                  <h3>ROI Medio</h3>
                  <p className={metrics.averageROI >= 0 ? 'profit-value' : 'loss-value'}>
                    {formatPercentage(metrics.averageROI)}
                  </p>
                </div>
              </div>
            </div>

            {/* Gráfico de rendimiento */}
            <div className="chart-card performance-chart">
              <div className="chart-header">
                <h2>Rendimiento por {performanceInterval === 'month' ? 'Mes' : 
                                     performanceInterval === 'week' ? 'Semana' : 
                                     performanceInterval === 'day' ? 'Día' : 'Año'}</h2>
                <div className="chart-actions">
                  <div className="interval-selector">
                    <button 
                      className={performanceInterval === 'month' ? 'active' : ''} 
                      onClick={() => setPerformanceInterval('month')}
                    >
                      Mes
                    </button>
                    <button 
                      className={performanceInterval === 'week' ? 'active' : ''} 
                      onClick={() => setPerformanceInterval('week')}
                    >
                      Semana
                    </button>
                  </div>
                </div>
              </div>
              <div className="chart-content">
                {timePerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={timePerformance}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={PROFIT_COLOR} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={PROFIT_COLOR} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="formattedTime" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="netProfit" 
                        name="Beneficio"
                        stroke={PROFIT_COLOR} 
                        fillOpacity={1} 
                        fill="url(#colorProfit)" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="trades" 
                        name="Operaciones"
                        stroke="#8884d8" 
                        strokeDasharray="5 5" 
                        dot={{ r: 4 }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data-message">
                    <p>No hay suficientes datos para mostrar el gráfico de rendimiento</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mejores y peores operaciones */}
            <div className="best-worst-trades">
              {metrics.bestTrade && (
                <div className="chart-card">
                  <div className="chart-header">
                    <h2>Mejor Operación</h2>
                  </div>
                  <div className="trade-details">
                    <div className="trade-detail-item">
                      <span className="detail-label">Par:</span>
                      <span className="detail-value">{metrics.bestTrade.symbol}</span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">Tipo:</span>
                      <span className="detail-value trade-type">
                        {metrics.bestTrade.type?.toUpperCase()} 
                        {metrics.bestTrade.operationType && 
                          <span className={`operation-type ${metrics.bestTrade.operationType}`}>
                            {metrics.bestTrade.operationType.charAt(0).toUpperCase() + metrics.bestTrade.operationType.slice(1)}
                          </span>
                        }
                      </span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">Beneficio:</span>
                      <span className="detail-value profit-value">
                        {formatCurrency(metrics.bestTrade.actualProfit || 0)}
                      </span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">ROI:</span>
                      <span className="detail-value profit-value">
                        {metrics.bestTrade.roi ? formatPercentage(metrics.bestTrade.roi) : 'N/A'}
                      </span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">Fecha:</span>
                      <span className="detail-value">
                        {new Date(metrics.bestTrade.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {metrics.worstTrade && (
                <div className="chart-card">
                  <div className="chart-header">
                    <h2>Peor Operación</h2>
                  </div>
                  <div className="trade-details">
                    <div className="trade-detail-item">
                      <span className="detail-label">Par:</span>
                      <span className="detail-value">{metrics.worstTrade.symbol}</span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">Tipo:</span>
                      <span className="detail-value trade-type">
                        {metrics.worstTrade.type?.toUpperCase()}
                        {metrics.worstTrade.operationType && 
                          <span className={`operation-type ${metrics.worstTrade.operationType}`}>
                            {metrics.worstTrade.operationType.charAt(0).toUpperCase() + metrics.worstTrade.operationType.slice(1)}
                          </span>
                        }
                      </span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">Pérdida:</span>
                      <span className="detail-value loss-value">
                        {formatCurrency(metrics.worstTrade.actualLoss || 0)}
                      </span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">ROI:</span>
                      <span className="detail-value loss-value">
                        {metrics.worstTrade.roi ? formatPercentage(metrics.worstTrade.roi) : 'N/A'}
                      </span>
                    </div>
                    <div className="trade-detail-item">
                      <span className="detail-label">Fecha:</span>
                      <span className="detail-value">
                        {new Date(metrics.worstTrade.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ratio Ganancia/Pérdida */}
            <div className="chart-card">
              <div className="chart-header">
                <h2>Ratio Ganancia/Pérdida</h2>
              </div>
              <div className="chart-content win-loss-chart">
                <div className="win-loss-container">
                  <div className="win-loss-bar">
                    <div 
                      className="win-bar" 
                      style={{ 
                        width: `${metrics.winningTrades + metrics.losingTrades > 0 
                          ? (metrics.winningTrades / (metrics.winningTrades + metrics.losingTrades)) * 100 
                          : 0}%` 
                      }}
                    >
                      <span className="win-loss-label">
                        {metrics.winningTrades} Ganancias
                      </span>
                    </div>
                    <div 
                      className="loss-bar" 
                      style={{ 
                        width: `${metrics.winningTrades + metrics.losingTrades > 0 
                          ? (metrics.losingTrades / (metrics.winningTrades + metrics.losingTrades)) * 100 
                          : 0}%` 
                      }}
                    >
                      <span className="win-loss-label">
                        {metrics.losingTrades} Pérdidas
                      </span>
                    </div>
                  </div>
                  <div className="win-loss-stats">
                    <div className="win-stat">
                      <FaArrowUp /> {formatPercentage(metrics.winRate)}
                    </div>
                    <div className="loss-stat">
                      <FaArrowDown /> {formatPercentage(100 - metrics.winRate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pestaña por Par */}
        {activeTab === 'pairs' && (
          <div className="pairs-analysis">
            <div className="chart-card">
              <div className="chart-header">
                <h2>Rendimiento por Par</h2>
              </div>
              <div className="chart-content">
                {pairData.length > 0 ? (
                  <div className="pairs-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Par</th>
                          <th>Operaciones</th>
                          <th>Win Rate</th>
                          <th>Beneficio Neto</th>
                          <th>ROI Medio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pairData.map((pair, index) => (
                          <tr key={index}>
                            <td className="pair-name">{pair.symbol}</td>
                            <td>{pair.trades}</td>
                            <td>{formatPercentage(pair.winRate)}</td>
                            <td className={pair.netProfit >= 0 ? 'profit-value' : 'loss-value'}>
                              {formatCurrency(pair.netProfit)}
                            </td>
                            <td className={pair.avgROI >= 0 ? 'profit-value' : 'loss-value'}>
                              {formatPercentage(pair.avgROI)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No hay datos disponibles para el análisis por par</p>
                  </div>
                )}
              </div>
            </div>

            {pairData.length > 0 && (
              <div className="chart-card">
                <div className="chart-header">
                  <h2>Beneficio por Par</h2>
                </div>
                <div className="chart-content" style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={pairData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="symbol" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80} 
                      />
                      <YAxis />
                      <Tooltip formatter={(value, name) => {
                        if (name === "netProfit") return formatCurrency(value);
                        return value;
                      }} />
                      <Bar dataKey="netProfit" name="Beneficio Neto">
                        {pairData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.netProfit >= 0 ? PROFIT_COLOR : LOSS_COLOR} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pestaña por Tipo */}
        {activeTab === 'types' && (
          <div className="types-analysis">
            {/* Análisis LONG vs SHORT */}
            <div className="chart-card">
              <div className="chart-header">
                <h2>LONG vs SHORT</h2>
              </div>
              <div className="chart-content">
                {typeData.length > 0 ? (
                  <>
                    <div className="type-comparison-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Operaciones</th>
                            <th>Win Rate</th>
                            <th>Beneficio Neto</th>
                            <th>ROI Medio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {typeData.map((type, index) => (
                            <tr key={index} className={type.type}>
                              <td>
                                <span className={`type-badge ${type.type}`}>
                                  {type.type.toUpperCase()}
                                </span>
                              </td>
                              <td>{type.trades}</td>
                              <td>{formatPercentage(type.winRate)}</td>
                              <td className={type.netProfit >= 0 ? 'profit-value' : 'loss-value'}>
                                {formatCurrency(type.netProfit)}
                              </td>
                              <td className={type.avgROI >= 0 ? 'profit-value' : 'loss-value'}>
                                {formatPercentage(type.avgROI)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="type-comparison-chart" style={{ height: '300px', marginTop: '2rem' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={typeData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" formatter={(value) => value && typeof value === 'string' ? value.toUpperCase() : 'N/A'} />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === "netProfit") return formatCurrency(value);
                              if (name === "winRate") return formatPercentage(value);
                              return value;
                            }} 
                          />
                          <Bar dataKey="netProfit" name="Beneficio Neto" fill={PROFIT_COLOR} />
                          <Bar dataKey="winRate" name="Win Rate" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="no-data-message">
                    <p>No hay datos suficientes para el análisis por tipo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Análisis por tipo de operación (Scalp, Swing, Spot) */}
            <div className="chart-card">
              <div className="chart-header">
                <h2>Por Tipo de Operación</h2>
              </div>
              <div className="chart-content">
                {operationTypeData.length > 0 ? (
                  <>
                    <div className="operation-type-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Operaciones</th>
                            <th>Win Rate</th>
                            <th>Beneficio Neto</th>
                            <th>ROI Medio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {operationTypeData.map((type, index) => (
                            <tr key={index}>
                              <td>
                                <span className={`operation-type-badge ${type.type}`}>
                                  {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
                                </span>
                              </td>
                              <td>{type.trades}</td>
                              <td>{formatPercentage(type.winRate)}</td>
                              <td className={type.netProfit >= 0 ? 'profit-value' : 'loss-value'}>
                                {formatCurrency(type.netProfit)}
                              </td>
                              <td className={type.avgROI >= 0 ? 'profit-value' : 'loss-value'}>
                                {formatPercentage(type.avgROI)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="operation-type-chart" style={{ height: '300px', marginTop: '2rem' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={operationTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="trades"
                            nameKey="type"
                            label={({ name, percent }) => 
                              `${name.charAt(0).toUpperCase() + name.slice(1)} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {operationTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name, props) => {
                            const data = props.payload;
                            if (name === "trades") return `${value} operaciones`;
                            return value;
                          }} />
                          <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="no-data-message">
                    <p>No hay suficientes datos para el análisis por tipo de operación</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pestaña Temporal */}
        {activeTab === 'time' && (
          <div className="time-analysis">
            <div className="chart-card">
              <div className="chart-header">
                <h2>Rendimiento a lo largo del tiempo</h2>
                <div className="chart-actions">
                  <div className="interval-selector">
                    <button 
                      className={performanceInterval === 'week' ? 'active' : ''} 
                      onClick={() => setPerformanceInterval('week')}
                    >
                      Semana
                    </button>
                    <button 
                      className={performanceInterval === 'month' ? 'active' : ''} 
                      onClick={() => setPerformanceInterval('month')}
                    >
                      Mes
                    </button>
                    <button 
                      className={performanceInterval === 'year' ? 'active' : ''} 
                      onClick={() => setPerformanceInterval('year')}
                    >
                      Año
                    </button>
                  </div>
                </div>
              </div>
              <div className="chart-content">
                {timePerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={timePerformance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="formattedTime" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                      />
                      <YAxis yAxisId="left" orientation="left" stroke={PROFIT_COLOR} />
                      <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "netProfit") return formatCurrency(value);
                          if (name === "trades") return `${value} operaciones`;
                          return value;
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="netProfit" 
                        name="Beneficio Neto" 
                        stroke={PROFIT_COLOR} 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="trades" 
                        name="Operaciones" 
                        stroke="#8884d8" 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data-message">
                    <p>No hay suficientes datos para el análisis temporal</p>
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h2>Evolución del Win Rate</h2>
              </div>
              <div className="chart-content">
                {timePerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={timePerformance.map(period => ({
                        ...period,
                        winRate: period.wins > 0 || period.losses > 0 ? 
                          (period.wins / (period.wins + period.losses)) * 100 : 0
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <defs>
                        <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="formattedTime" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "winRate") return formatPercentage(value);
                          return value;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="winRate" 
                        name="Win Rate" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorWinRate)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data-message">
                    <p>No hay suficientes datos para mostrar la evolución del Win Rate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección de consejos */}
      <div className="tips-section">
        <div className="tip-card">
          <div className="tip-icon">
            <FaRegLightbulb />
          </div>
          <div className="tip-content">
            <h3>Consejo del día</h3>
            <p>Mantén un diario detallado de tus operaciones para identificar patrones y mejorar tu estrategia.</p>
          </div>
        </div>
        <div className="tip-card">
          <div className="tip-icon">
            <FaRegClock />
          </div>
          <div className="tip-content">
            <h3>Recordatorio</h3>
            <p>Revisa tus operaciones semanalmente para ajustar tu estrategia y mejorar tus resultados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 