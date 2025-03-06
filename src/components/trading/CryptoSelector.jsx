import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';
import CryptoLogo from '../portfolio/CryptoLogo';
import './CryptoSelector.css';

// Lista de criptomonedas populares (podrías expandir esta lista)
const popularCryptos = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'ATOM', name: 'Cosmos' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'ALGO', name: 'Algorand' },
  { symbol: 'NEAR', name: 'Near Protocol' },
  { symbol: 'FTM', name: 'Fantom' },
  { symbol: 'SAND', name: 'The Sandbox' },
  { symbol: 'MANA', name: 'Decentraland' },
  { symbol: 'AXS', name: 'Axie Infinity' },
  { symbol: 'AAVE', name: 'Aave' },
  { symbol: 'CRO', name: 'Cronos' },
  { symbol: 'EGLD', name: 'Elrond' },
  { symbol: 'HBAR', name: 'Hedera' },
  { symbol: 'EOS', name: 'EOS' },
  { symbol: 'CAKE', name: 'PancakeSwap' },
  { symbol: 'XTZ', name: 'Tezos' },
  { symbol: 'FLOW', name: 'Flow' },
  { symbol: 'ONE', name: 'Harmony' },
  { symbol: 'KSM', name: 'Kusama' },
  { symbol: 'NEO', name: 'NEO' },
  { symbol: 'XMR', name: 'Monero' },
  { symbol: 'DASH', name: 'Dash' },
  { symbol: 'ZEC', name: 'Zcash' },
  { symbol: 'ENJ', name: 'Enjin Coin' },
  { symbol: 'CHZ', name: 'Chiliz' },
  { symbol: 'BAT', name: 'Basic Attention Token' },
  { symbol: 'ZIL', name: 'Zilliqa' },
  { symbol: 'SHIB', name: 'Shiba Inu' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'DAI', name: 'Dai' },
  { symbol: 'BUSD', name: 'Binance USD' }
];

// Función para buscar más criptomonedas en la API de CoinGecko
const fetchMoreCryptos = async (searchTerm) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`);
    
    if (!response.ok) {
      throw new Error('Error en la búsqueda');
    }
    
    const data = await response.json();
    
    // Extraer y formatear los resultados
    return data.coins.slice(0, 20).map(coin => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      id: coin.id,
      thumb: coin.thumb
    }));
  } catch (error) {
    console.error('Error al buscar criptomonedas:', error);
    return [];
  }
};

const CryptoSelector = ({ onSelect, label = 'Seleccionar Criptomoneda', placeholder = 'Buscar...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoList, setCryptoList] = useState(popularCryptos);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);
  
  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Buscar criptomonedas cuando cambia el término de búsqueda
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.length > 0) {
        setLoading(true);
        
        // Primero filtrar la lista local
        const filteredLocal = popularCryptos.filter(
          crypto => 
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Si hay suficientes resultados locales, usar solo esos
        if (filteredLocal.length >= 5) {
          setCryptoList(filteredLocal);
          setLoading(false);
        } else {
          // Si no hay suficientes resultados locales, consultar la API
          try {
            const apiResults = await fetchMoreCryptos(searchTerm);
            
            // Combinar resultados locales y de API, eliminando duplicados
            const combinedResults = [...filteredLocal];
            
            apiResults.forEach(apiCrypto => {
              if (!combinedResults.some(localCrypto => localCrypto.symbol === apiCrypto.symbol)) {
                combinedResults.push(apiCrypto);
              }
            });
            
            setCryptoList(combinedResults);
          } catch (error) {
            console.error('Error en la búsqueda:', error);
            setCryptoList(filteredLocal);
          }
        }
        
        setLoading(false);
      } else {
        // Si no hay término de búsqueda, mostrar las criptomonedas populares
        setCryptoList(popularCryptos);
      }
    }, 300); // Retraso de 300ms para evitar demasiadas llamadas
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);
  
  const handleSelectCrypto = (crypto) => {
    setSelected(crypto);
    setSearchTerm('');
    setIsOpen(false);
    onSelect(crypto);
  };
  
  const handleClear = () => {
    setSelected(null);
    setSearchTerm('');
    onSelect(null);
  };
  
  return (
    <div className="crypto-selector-container">
      <label className="crypto-selector-label">{label}</label>
      
      <div className="crypto-selector" ref={dropdownRef}>
        {selected ? (
          <div className="selected-crypto">
            <CryptoLogo symbol={selected.symbol} name={selected.name} />
            <div className="selected-crypto-info">
              <span className="selected-crypto-symbol">{selected.symbol}</span>
              <span className="selected-crypto-name">{selected.name}</span>
            </div>
            <button className="clear-button" onClick={handleClear}>
              <FaTimesCircle />
            </button>
          </div>
        ) : (
          <div className="search-box" onClick={() => setIsOpen(true)}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="search-input"
            />
          </div>
        )}
        
        {isOpen && !selected && (
          <div className="crypto-dropdown">
            {loading ? (
              <div className="loading-indicator">Buscando...</div>
            ) : cryptoList.length > 0 ? (
              <ul className="crypto-list">
                {cryptoList.map((crypto, index) => (
                  <li 
                    key={`${crypto.symbol}-${index}`}
                    className="crypto-item"
                    onClick={() => handleSelectCrypto(crypto)}
                  >
                    <CryptoLogo symbol={crypto.symbol} name={crypto.name} />
                    <div className="crypto-info">
                      <span className="crypto-symbol">{crypto.symbol}</span>
                      <span className="crypto-name">{crypto.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-results">No se encontraron resultados</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoSelector; 