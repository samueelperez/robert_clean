import React, { useState, useEffect } from 'react';
import { useTrades } from '../context/TradeContext';
import TradeForm from '../components/trades/TradeForm';
import TradeList from '../components/trades/TradeList';
// Comentamos temporalmente hasta que el componente esté listo
// import TradeStats from '../components/trades/TradeStats';
import { FaPlus, FaFilter, FaArrowRight } from 'react-icons/fa';
import TradingChart from '../components/graphics/TradingChart';

const TradeJournal = () => {
  const { trades } = useTrades();
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [filters, setFilters] = useState({
    symbol: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [filteredTrades, setFilteredTrades] = useState([]);

  // Comprobar si ya hay operaciones para mostrar la bienvenida o no
  useEffect(() => {
    if (trades.length > 0) {
      setShowWelcome(false);
    }
  }, [trades]);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    let result = [...trades];
    
    if (filters.symbol) {
      result = result.filter(trade => 
        trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      );
    }
    
    if (filters.type) {
      result = result.filter(trade => trade.type === filters.type);
    }
    
    if (filters.status) {
      result = result.filter(trade => trade.status === filters.status);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(trade => new Date(trade.entryDate) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Final del día
      result = result.filter(trade => new Date(trade.entryDate) <= toDate);
    }
    
    setFilteredTrades(result);
  }, [trades, filters]);

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      symbol: '',
      type: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Comenzar a usar el diario
  const startJournal = () => {
    setShowWelcome(false);
    setShowForm(true);
  };

  if (showWelcome && trades.length === 0) {
    return (
      <div className="trade-journal-container">
        <div className="trade-journal-welcome">
          <h1>Diario de Operaciones</h1>
          <p>Registra, analiza y mejora tus operaciones de trading. Lleva un seguimiento detallado de tus entradas y salidas para optimizar tu estrategia.</p>
          
          <div className="chart-container">
            <img 
              src="/images/trading-chart.png" 
              alt="Gráfico de trading" 
              className="chart-image"
              onError={(e) => {
                e.target.style.display = 'none';
                document.getElementById('welcome-chart').style.display = 'block';
              }}
            />
            <div id="welcome-chart" style={{display: 'none', width: '100%', maxWidth: '700px'}}>
              <TradingChart />
            </div>
          </div>
          
          <button className="start-button" onClick={startJournal}>
            Comenzar ahora <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-journal-container">
      <div className="trade-journal-header">
        <h2>Diario de Operaciones</h2>
        
        <div className="trade-journal-actions">
          <button onClick={() => setShowForm(!showForm)}>
            <FaPlus /> {showForm ? 'Cancelar' : 'Nueva Operación'}
          </button>
          <button onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
          </button>
        </div>
      </div>
      
      {showForm && <TradeForm onComplete={() => setShowForm(false)} />}
      
      {showFilters && (
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="symbol">Símbolo</label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={filters.symbol}
              onChange={handleFilterChange}
              placeholder="Ej: EURUSD"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="long">Compra (Long)</option>
              <option value="short">Venta (Short)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="open">Abierta</option>
              <option value="closed">Cerrada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="dateFrom">Desde</label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="dateTo">Hasta</label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
            <button onClick={clearFilters} className="cancel-btn">
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}
      
      <div className="trade-journal-layout">
        <div className="trade-journal-main">
          <TradeList trades={filteredTrades} />
        </div>
        {/* Comentamos temporalmente hasta que el componente esté listo
        <div className="trade-journal-sidebar">
          <TradeStats trades={trades} />
        </div>
        */}
      </div>
    </div>
  );
};

export default TradeJournal; 