import React from 'react';
import WinRateChart from '../components/charts/WinRateChart';
import ProfitByInstrument from '../components/charts/ProfitByInstrument';
import MonthlyPerformance from '../components/charts/MonthlyPerformance';
import PerformanceMetrics from '../components/performance/PerformanceMetrics';

const Performance = () => {
  return (
    <div className="performance-container">
      <h1>Análisis de Rendimiento</h1>
      
      <div className="metrics-overview">
        <PerformanceMetrics />
      </div>
      
      <div className="charts-grid">
        <WinRateChart />
        <ProfitByInstrument />
        <MonthlyPerformance />
      </div>
    </div>
  );
};

export default Performance; 