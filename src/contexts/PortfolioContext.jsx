const updateAsset = (exchangeId, assetId, updates) => {
  setExchanges(prevExchanges => {
    const updatedExchanges = prevExchanges.map(exchange => {
      if (exchange.id === exchangeId) {
        const updatedAssets = exchange.assets.map(asset => {
          if (asset.id === assetId) {
            const newAmount = updates.amount !== undefined ? updates.amount : asset.amount;
            const newValueUSDT = newAmount * asset.priceUSDT;
            
            return {
              ...asset,
              ...updates,
              amount: newAmount,
              valueUSDT: newValueUSDT,
              lastUpdated: new Date().toISOString()
            };
          }
          return asset;
        });
        
        const totalValue = updatedAssets.reduce((sum, asset) => {
          const assetValue = asset.valueUSDT || 0;
          return sum + assetValue;
        }, 0);
        
        return {
          ...exchange,
          assets: updatedAssets,
          totalValue: totalValue
        };
      }
      return exchange;
    });
    
    // Actualizar localStorage
    localStorage.setItem('exchanges', JSON.stringify(updatedExchanges));
    
    return updatedExchanges;
  });
}; 