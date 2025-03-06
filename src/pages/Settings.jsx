import React from 'react';

const Settings = () => {
  return (
    <div className="settings-container">
      <h1>Configuración</h1>
      
      <div className="settings-section">
        <h2>Preferencias de Usuario</h2>
        <form>
          <div className="form-group">
            <label htmlFor="currency">Moneda Base</label>
            <select id="currency" name="currency" defaultValue="EUR">
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dólar ($)</option>
              <option value="GBP">Libra Esterlina (£)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="theme">Tema</label>
            <select id="theme" name="theme" defaultValue="light">
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="dateFormat">Formato de Fecha</label>
            <select id="dateFormat" name="dateFormat" defaultValue="DD/MM/YYYY">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary">Guardar Preferencias</button>
        </form>
      </div>
      
      <div className="settings-section">
        <h2>Instrumentos de Trading</h2>
        <p>Configura los instrumentos que utilizas para trading</p>
        
        <div className="instruments-list">
          {/* Aquí iría una lista de instrumentos con opción de añadir/eliminar */}
          <div className="instrument-item">
            <span>EUR/USD</span>
            <button className="btn-remove">Eliminar</button>
          </div>
          <div className="instrument-item">
            <span>BTC/USD</span>
            <button className="btn-remove">Eliminar</button>
          </div>
        </div>
        
        <form className="add-instrument-form">
          <input type="text" placeholder="Nuevo instrumento" />
          <button type="submit" className="btn-add">Añadir</button>
        </form>
      </div>
      
      <div className="settings-section">
        <h2>Exportar/Importar Datos</h2>
        <div className="export-import-buttons">
          <button className="btn-export">Exportar Datos</button>
          <button className="btn-import">Importar Datos</button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 