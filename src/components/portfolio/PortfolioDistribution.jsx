import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PortfolioDistribution = ({ exchanges }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Paleta de colores mejorada
  const colorPalette = [
    '#FF6384', // Rosa
    '#36A2EB', // Azul
    '#FFCE56', // Amarillo
    '#4BC0C0', // Turquesa
    '#9966FF', // Púrpura
    '#FF9F40', // Naranja
    '#8AC926', // Verde lima
    '#F94144', // Rojo
    '#F3722C', // Naranja brillante
    '#F8961E', // Naranja suave
    '#F9C74F', // Amarillo dorado
    '#90BE6D', // Verde medio
    '#43AA8B', // Verde turquesa
    '#577590', // Azul grisáceo
    '#277DA1', // Azul oscuro
    '#6D597A', // Púrpura grisáceo
    '#B56576', // Rosa viejo
    '#E56B6F', // Salmón
    '#EAAC8B', // Melocotón
    '#E76F51', // Coral
  ];
  
  useEffect(() => {
    if (exchanges.length === 0) return;
    
    // Preparar datos para el gráfico
    const prepareChartData = () => {
      // Agrupar activos por símbolo a través de todos los exchanges
      const assetsBySymbol = {};
      
      exchanges.forEach(exchange => {
        if (!exchange.assets) return;
        
        exchange.assets.forEach(asset => {
          if (!assetsBySymbol[asset.symbol]) {
            assetsBySymbol[asset.symbol] = {
              symbol: asset.symbol,
              name: asset.name,
              totalValue: 0
            };
          }
          
          assetsBySymbol[asset.symbol].totalValue += asset.valueUSDT;
        });
      });
      
      // Convertir a array y ordenar por valor
      return Object.values(assetsBySymbol)
        .sort((a, b) => b.totalValue - a.totalValue);
    };
    
    const chartData = prepareChartData();
    
    // Crear o actualizar el gráfico
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Agrupar pequeños activos como "Otros" si hay muchos
      let processedData = chartData;
      const MAX_SLICES = 10;
      
      if (chartData.length > MAX_SLICES) {
        const mainAssets = chartData.slice(0, MAX_SLICES - 1);
        const otherAssets = chartData.slice(MAX_SLICES - 1);
        
        const otherValue = otherAssets.reduce((sum, asset) => sum + asset.totalValue, 0);
        
        if (otherValue > 0) {
          mainAssets.push({
            symbol: 'Otros',
            name: 'Activos diversos',
            totalValue: otherValue
          });
        }
        
        processedData = mainAssets;
      }
      
      // Calcular el total
      const totalValue = processedData.reduce((sum, asset) => sum + asset.totalValue, 0);
      
      // Asignar colores de la paleta mejorada
      const backgroundColors = processedData.map((_, index) => 
        colorPalette[index % colorPalette.length]
      );
      
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: processedData.map(asset => 
            `${asset.symbol} (${(asset.totalValue / totalValue * 100).toFixed(1)}%)`
          ),
          datasets: [{
            data: processedData.map(asset => asset.totalValue),
            backgroundColor: backgroundColors,
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                padding: 15,
                font: {
                  size: 12
                },
                color: '#334155'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const percentage = (value / totalValue * 100).toFixed(1);
                  return `${context.label.split(' (')[0]}: $${value.toFixed(2)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // Limpiar al desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [exchanges]);
  
  if (exchanges.length === 0) {
    return (
      <div className="empty-distribution">
        <p>Añade exchanges y activos para ver la distribución de tu portfolio.</p>
      </div>
    );
  }
  
  return (
    <div className="portfolio-distribution">
      <div className="chart-container">
        <canvas ref={chartRef} height="300"></canvas>
      </div>
      <div className="distribution-legend">
        <h4>Valor Total: ${exchanges.reduce((total, exchange) => 
          total + (exchange.totalValue || 0), 0).toFixed(2)}</h4>
      </div>
    </div>
  );
};

export default PortfolioDistribution; 