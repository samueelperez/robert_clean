import React from 'react';
import { useTrades } from '../../context/TradeContext';

const DataExportImport = () => {
  const { trades } = useTrades();
  
  const handleExport = () => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `trading-journal-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        // Aquí implementarías la lógica para importar los datos
        console.log('Datos importados:', importedData);
        alert('Datos importados correctamente');
      } catch (error) {
        console.error('Error al importar datos:', error);
        alert('Error al importar datos. Asegúrate de que el archivo es válido.');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="data-export-import">
      <h3>Exportar/Importar Datos</h3>
      
      <div className="export-import-buttons">
        <button className="btn-export" onClick={handleExport}>
          Exportar Datos
        </button>
        
        <div className="import-container">
          <label htmlFor="import-file" className="btn-import">
            Importar Datos
          </label>
          <input
            type="file"
            id="import-file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
      </div>
    </div>
  );
};

export default DataExportImport; 