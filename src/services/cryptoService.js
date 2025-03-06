// Servicio para obtener datos de criptomonedas desde CoinGecko
const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const ALTERNATIVE_API_URL = 'https://api.coincap.io/v2'; // API alternativa

// Caché local para reducir llamadas a la API
const priceCache = {
  data: {},
  timestamp: {}
};

// Tiempo de expiración del caché en milisegundos (5 minutos)
const CACHE_EXPIRY = 5 * 60 * 1000;

// Obtener precio actual de una criptomoneda en USD
export const getCurrentPrice = async (coinId) => {
  try {
    // Verificar si tenemos un precio en caché que no haya expirado
    const now = Date.now();
    if (priceCache.data[coinId] && (now - priceCache.timestamp[coinId] < CACHE_EXPIRY)) {
      // Reducir la cantidad de logs para evitar spam en la consola
      if (!window.priceCacheLogged) {
        window.priceCacheLogged = {};
      }
      if (!window.priceCacheLogged[coinId]) {
        console.log(`Usando precio en caché para ${coinId}`);
        window.priceCacheLogged[coinId] = true;
        // Resetear el log después de un tiempo
        setTimeout(() => {
          window.priceCacheLogged[coinId] = false;
        }, 10000);
      }
      return priceCache.data[coinId];
    }
    
    // Intentar con CoinGecko
    try {
      const response = await fetch(`${API_BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000 // Timeout de 5 segundos
      });
      
      if (response.ok) {
        const data = await response.json();
        const price = data[coinId]?.usd;
        
        if (price) {
          // Guardar en caché
          priceCache.data[coinId] = price;
          priceCache.timestamp[coinId] = now;
          return price;
        }
      }
      
      // Si llegamos aquí, CoinGecko no funcionó, intentar con la API alternativa
      throw new Error('CoinGecko API no disponible');
    } catch (error) {
      console.warn('Error con CoinGecko, intentando API alternativa:', error);
      
      // Intentar con CoinCap como alternativa
      const symbol = coinId.toUpperCase();
      const alternativeResponse = await fetch(`${ALTERNATIVE_API_URL}/assets/${symbol}`);
      
      if (alternativeResponse.ok) {
        const data = await alternativeResponse.json();
        const price = parseFloat(data.data?.priceUsd);
        
        if (!isNaN(price)) {
          // Guardar en caché
          priceCache.data[coinId] = price;
          priceCache.timestamp[coinId] = now;
          return price;
        }
      }
      
      // Si llegamos aquí, ninguna API funcionó
      throw new Error('No se pudo obtener el precio');
    }
  } catch (error) {
    console.error('Error en getCurrentPrice:', error);
    
    // Para stablecoins, devolver 1 incluso si fallan las APIs
    if (['usdt', 'usdc', 'dai', 'busd', 'ust', 'tusd', 'usdp', 'frax'].includes(coinId.toLowerCase())) {
      return 1.0;
    }
    
    // Devolver el último precio en caché si existe
    if (priceCache.data[coinId]) {
      console.warn(`Usando precio en caché desactualizado para ${coinId}`);
      return priceCache.data[coinId];
    }
    
    // Si no hay caché, devolver null
    return null;
  }
};

// Buscar una criptomoneda por nombre o símbolo con manejo de errores mejorado
export const searchCoin = async (query) => {
  try {
    // Intentar con CoinGecko
    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${query}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.coins || [];
      }
      
      throw new Error('CoinGecko search no disponible');
    } catch (error) {
      console.warn('Error con CoinGecko search, usando mapeo local:', error);
      
      // Usar un mapeo local básico para las principales criptomonedas
      const commonCoins = [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
        { id: 'binancecoin', symbol: 'bnb', name: 'Binance Coin' },
        { id: 'ripple', symbol: 'xrp', name: 'XRP' },
        { id: 'cardano', symbol: 'ada', name: 'Cardano' },
        { id: 'solana', symbol: 'sol', name: 'Solana' },
        { id: 'polkadot', symbol: 'dot', name: 'Polkadot' },
        { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
        { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche' },
        { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu' },
        { id: 'matic-network', symbol: 'matic', name: 'Polygon' },
        { id: 'tron', symbol: 'trx', name: 'TRON' },
        { id: 'litecoin', symbol: 'ltc', name: 'Litecoin' },
        { id: 'chainlink', symbol: 'link', name: 'Chainlink' },
        { id: 'uniswap', symbol: 'uni', name: 'Uniswap' },
        { id: 'tether', symbol: 'usdt', name: 'Tether' },
        { id: 'usd-coin', symbol: 'usdc', name: 'USD Coin' },
        { id: 'dai', symbol: 'dai', name: 'Dai' }
      ];
      
      const lowerQuery = query.toLowerCase();
      return commonCoins.filter(coin => 
        coin.id.includes(lowerQuery) || 
        coin.symbol.includes(lowerQuery) || 
        coin.name.toLowerCase().includes(lowerQuery)
      );
    }
  } catch (error) {
    console.error('Error en searchCoin:', error);
    return [];
  }
};

// Obtener lista de las principales criptomonedas
export const getTopCoins = async (limit = 100) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`
    );
    if (!response.ok) {
      throw new Error('Error al obtener las principales criptomonedas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getTopCoins:', error);
    throw error;
  }
};

// Obtener datos históricos de precios
export const getHistoricalPrices = async (coinId, days = 30) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!response.ok) {
      throw new Error('Error al obtener datos históricos');
    }
    const data = await response.json();
    return data.prices || [];
  } catch (error) {
    console.error('Error en getHistoricalPrices:', error);
    throw error;
  }
};

// Convertir símbolo a ID de CoinGecko con manejo de errores mejorado
export const symbolToId = async (symbol) => {
  if (!symbol) return null;
  
  try {
    // Limpiar el símbolo (quitar /USDT, etc.)
    const cleanSymbol = symbol.split('/')[0].toLowerCase();
    
    // Mapeo directo para las principales criptomonedas para evitar llamadas a la API
    const commonSymbolMap = {
      'btc': 'bitcoin',
      'eth': 'ethereum',
      'bnb': 'binancecoin',
      'xrp': 'ripple',
      'ada': 'cardano',
      'sol': 'solana',
      'dot': 'polkadot',
      'doge': 'dogecoin',
      'avax': 'avalanche-2',
      'shib': 'shiba-inu',
      'matic': 'matic-network',
      'trx': 'tron',
      'ltc': 'litecoin',
      'link': 'chainlink',
      'uni': 'uniswap',
      'usdt': 'tether',
      'usdc': 'usd-coin',
      'dai': 'dai'
    };
    
    // Si es una moneda común, usar el mapeo directo
    if (commonSymbolMap[cleanSymbol]) {
      return commonSymbolMap[cleanSymbol];
    }
    
    // Si no, intentar buscar
    const searchResults = await searchCoin(cleanSymbol);
    if (searchResults.length > 0) {
      // Filtrar para encontrar la coincidencia exacta o la más cercana
      const exactMatch = searchResults.find(
        coin => coin.symbol.toLowerCase() === cleanSymbol
      );
      return exactMatch ? exactMatch.id : searchResults[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Error en symbolToId:', error);
    return null;
  }
}; 