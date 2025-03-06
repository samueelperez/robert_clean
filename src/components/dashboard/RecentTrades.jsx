import React from 'react';

const RecentTrades = () => {
  // Datos de ejemplo
  const trades = [
    {
      id: '1',
      date: '2023-03-01',
      instrument: 'EUR/USD',
      type: 'BUY',
      profit: 50,
      result: 'WIN'
    },
    {
      id: '2',
      date: '2023-03-02',
      instrument: 'BTC/USD',
      type: 'SELL',
      profit: -30,
      result: 'LOSS'
    },
    {
      id: '3',
      date: '2023-03-03',
      instrument: 'EUR/JPY',
      type: 'BUY',
      profit: 25,
      result: 'WIN'
    }
  ];

  return (
    <div className="recent-trades">
      <h3>Operaciones Recientes</h3>
      
      <div className="trades-list">
        {trades.map(trade => (
          <div key={trade.id} className="trade-item">
            <div className="trade-date">{trade.date}</div>
            <div className="trade-instrument">{trade.instrument}</div>
            <div className="trade-type">{trade.type}</div>
            <div className={`trade-profit ${trade.profit >= 0 ? 'positive' : 'negative'}`}>
              {trade.profit > 0 ? '+' : ''}{trade.profit}€
            </div>
          </div>
        ))}
      </div>
      
      <button className="btn-view-all">Ver Todas</button>
    </div>
  );
};

export default RecentTrades; 