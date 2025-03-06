import React, { useState, useEffect } from 'react';
import { FaCoins } from 'react-icons/fa';

const CryptoLogo = ({ symbol, name }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Función para normalizar el símbolo de la criptomoneda
  const normalizeSymbol = (symbol) => {
    return symbol.split('/')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  };
  
  useEffect(() => {
    setIsLoading(true);
    setLoadingStage(0);
    
    const normalizedSymbol = normalizeSymbol(symbol);
    
    // Intentar con la primera API (CoinCap)
    setImageUrl(`https://assets.coincap.io/assets/icons/${normalizedSymbol}@2x.png`);
  }, [symbol]);
  
  const tryNextSource = () => {
    const normalizedSymbol = normalizeSymbol(symbol);
    setLoadingStage(prevStage => {
      const newStage = prevStage + 1;
      
      switch (newStage) {
        case 1:
          // Segunda fuente: CryptoCompare
          setImageUrl(`https://www.cryptocompare.com/media/37746238/${normalizedSymbol}.png`);
          break;
        case 2:
          // Tercera fuente: CoinGecko
          setImageUrl(`https://static.coingecko.com/coins/images/1/${normalizedSymbol}.png?1547033579`);
          break;
        case 3:
          // Cuarta fuente: Paprika
          setImageUrl(`https://s2.coinmarketcap.com/static/img/coins/64x64/${normalizedSymbol}.png`);
          break;
        case 4:
          // Quinta fuente: Genérica basada en símbolo
          setImageUrl(`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${normalizedSymbol}.png`);
          break;
        default:
          // Si todas fallan, usar un ícono genérico en lugar de la letra
          setImageUrl(null);
          setIsLoading(false);
          break;
      }
      
      return newStage;
    });
  };
  
  const handleImageError = () => {
    tryNextSource();
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <div className="asset-icon">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`${symbol} logo`} 
          className="crypto-logo" 
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      ) : (
        <div className="crypto-generic-icon">
          <FaCoins className="generic-coin-icon" />
        </div>
      )}
      
      {isLoading && (
        <div className="crypto-logo-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CryptoLogo; 