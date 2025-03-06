import React from 'react';
import { useTrades } from '../../context/TradeContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const TradeList = ({ trades }) => {
  const { deleteTrade } = useTrades();

  // Formatear fecha
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  };

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  // Calcular resultado
  const calculateResult = (trade) => {
    if (trade.status !== 'closed') return null;
    
    const entryValue = trade.entryPrice * trade.size;
    const exitValue = trade.exitPrice * trade.size;
    
    return trade.type === 'long' 
      ? exitValue - entryValue 
      : entryValue - exitValue;
  };

  if (trades.length === 0) {
    return (
      <div className="empty-state">
        <h3>No hay operaciones registradas</h3>
        <p>Comienza a registrar tus operaciones para hacer un seguimiento de tu rendimiento.</p>
      </div>
    );
  }

  return (
    <div className="trades-table-container">
      <table className="trades-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Símbolo</th>
            <th>Tipo</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Tamaño</th>
            <th>Estado</th>
            <th>Resultado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => {
            const result = calculateResult(trade);
            
            return (
              <tr key={trade.id}>
                <td>{formatDate(trade.entryDate)}</td>
                <td>{trade.symbol}</td>
                <td>{trade.type === 'long' ? 'Compra' : 'Venta'}</td>
                <td>{formatCurrency(trade.entryPrice)}</td>
                <td>{trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}</td>
                <td>{trade.size}</td>
                <td>
                  <span className={`trade-status ${trade.status}`}>
                    {trade.status === 'open' && 'Abierta'}
                    {trade.status === 'closed' && 'Cerrada'}
                    {trade.status === 'cancelled' && 'Cancelada'}
                  </span>
                </td>
                <td>
                  {result !== null ? (
                    <span className={`trade-result ${result >= 0 ? 'profit' : 'loss'}`}>
                      {formatCurrency(result)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <div className="trade-actions">
                    <button className="view-btn" title="Ver detalles">
                      <FaEye />
                    </button>
                    <button className="edit-btn" title="Editar">
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn" 
                      title="Eliminar"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que quieres eliminar esta operación?')) {
                          deleteTrade(trade.id);
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TradeList; 