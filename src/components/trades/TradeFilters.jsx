import React from 'react';

const TradeFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="trade-filters">
      <h3>Filtros</h3>
      
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="dateRange">Rango de Fechas</label>
          <select
            id="dateRange"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="instrument">Instrumento</label>
          <select
            id="instrument"
            name="instrument"
            value={filters.instrument}
            onChange={handleFilterChange}
          >
            <option value="all">Todos los instrumentos</option>
            <option value="EUR/USD">EUR/USD</option>
            <option value="BTC/USD">BTC/USD</option>
            <option value="EUR/JPY">EUR/JPY</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="result">Resultado</label>
          <select
            id="result"
            name="result"
            value={filters.result}
            onChange={handleFilterChange}
          >
            <option value="all">Todos los resultados</option>
            <option value="WIN">Ganancia</option>
            <option value="LOSS">Pérdida</option>
            <option value="BREAKEVEN">Punto de Equilibrio</option>
          </select>
        </div>
        
        <button className="btn-reset-filters" onClick={() => setFilters({
          dateRange: 'all',
          instrument: 'all',
          result: 'all'
        })}>
          Resetear Filtros
        </button>
      </div>
    </div>
  );
};

export default TradeFilters; 