import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TradeStats = ({ trades }) => {
  // Calcular estadísticas
  const calculateStats = () => {
    const closedTrades = trades.filter(trade => trade.status === 'closed');
    
    if (closedTrades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        averageProfit: 0,
        averageLoss: 0,
        profitFactor: 0,
        largestProfit: 0,
        largestLoss: 0
      };
    }
    
    let winningTrades = 0;
    let losingTrades = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let largestProfit = 0;
    let largestLoss = 0;
    
    closedTrades.forEach(trade => {
      const entryValue = trade.entryPrice * trade.size;
      const exitValue = trade.exitPrice * trade.size;
      
      const result = trade.type === 'long' 
        ? exitValue - entryValue 
        : entryValue - exitValue;
      
      if (result > 0) {
        winningTrades++;
        totalProfit += result;
        largestProfit = Math.max(largestProfit, result);
      } else {
        losingTrades++;
        totalLoss += Math.abs(result);
        largestLoss = Math.max(largestLoss, Math.abs(result));
      }
    });
    
    const winRate = (winningTrades / closedTrades.length) * 100;
    const netProfit = totalProfit - totalLoss;
    const averageProfit = winningTrades > 0 ? totalProfit / winningTrades : 0;
    const averageLoss = losingTrades > 0 ? totalLoss / losingTrades : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
    
    return {
      totalTrades: closedTrades.length,
      winningTrades,
      losingTrades,
      winRate,
      totalProfit,
      totalLoss,
      netProfit,
      averageProfit,
      averageLoss,
      profitFactor,
      largestProfit,
      largestLoss
    };
  };
  
  const stats = calculateStats();
  
  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };
  
  // Formatear porcentaje
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Datos para el gráfico de resultados
  const resultData = [
    { name: 'Ganadas', value: stats.winningTrades },
    { name: 'Perdidas', value: stats.losingTrades }
  ];
  
  // Colores para el gráfico
  const COLORS = ['#10b981', '#ef4444'];
  
  // Renderizar etiqueta personalizada
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="trade-stats">
      <h3>Estadísticas de Trading</h3>
      
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-title">Operaciones Totales</div>
          <div className="stat-value">{stats.totalTrades}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Ratio de Victorias</div>
          <div className="stat-value">{formatPercentage(stats.winRate)}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Beneficio Neto</div>
          <div className={`stat-value ${stats.netProfit >= 0 ? 'profit' : 'loss'}`}>
            {formatCurrency(stats.netProfit)}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Factor de Beneficio</div>
          <div className="stat-value">{stats.profitFactor.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="stats-details">
        <div className="stats-section">
          <h4>Desglose de Operaciones</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Operaciones Ganadas</div>
              <div className="stat-value profit">{stats.winningTrades}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Operaciones Perdidas</div>
              <div className="stat-value loss">{stats.losingTrades}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Beneficio Total</div>
              <div className="stat-value profit">{formatCurrency(stats.totalProfit)}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Pérdida Total</div>
              <div className="stat-value loss">{formatCurrency(stats.totalLoss)}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Beneficio Medio</div>
              <div className="stat-value profit">{formatCurrency(stats.averageProfit)}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Pérdida Media</div>
              <div className="stat-value loss">{formatCurrency(stats.averageLoss)}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Mayor Beneficio</div>
              <div className="stat-value profit">{formatCurrency(stats.largestProfit)}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Mayor Pérdida</div>
              <div className="stat-value loss">{formatCurrency(stats.largestLoss)}</div>
            </div>
          </div>
        </div>
        
        <div className="stats-section">
          <h4>Distribución de Resultados</h4>
          <div className="stats-chart">
            {stats.totalTrades > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={resultData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No hay datos suficientes para mostrar el gráfico.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeStats; 