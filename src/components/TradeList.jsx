import React from 'react';
import { useContext } from 'react';
import { TradeContext } from '../context/TradeContext';

const TradeList = () => {
  // Antes:
  // const { trades, deleteTrade } = useTrades();
  
  // Después:
  const { trades, deleteTrade } = useContext(TradeContext);
  
  // Resto del componente...
}; 