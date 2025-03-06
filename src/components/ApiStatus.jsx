import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/ApiStatus.css';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/ping');
        if (response.ok) {
          setStatus('connected');
        } else {
          setStatus('limited');
        }
      } catch (error) {
        console.error('Error al verificar estado de API:', error);
        setStatus('disconnected');
      }
    };
    
    // Solo verificar una vez al montar el componente
    checkApiStatus();
    
    // Verificar cada 5 minutos
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (status === 'checking') {
    return null;
  }
  
  return (
    <div className={`api-status ${status}`}>
      {status === 'connected' ? (
        <>
          <FaCheckCircle className="status-icon" />
          <span>API conectada</span>
        </>
      ) : (
        <>
          <FaExclamationTriangle className="status-icon" />
          <span>
            {status === 'limited' 
              ? 'API con límites' 
              : 'API desconectada - usando datos en caché'}
          </span>
        </>
      )}
    </div>
  );
};

export default ApiStatus; 