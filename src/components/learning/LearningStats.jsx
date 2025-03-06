import React from 'react';

const LearningStats = () => {
  // Datos de ejemplo
  const stats = {
    totalEntries: 24,
    entriesThisMonth: 8,
    topTags: ['technical-analysis', 'psychology', 'risk-management'],
    streakDays: 5
  };

  return (
    <div className="learning-stats">
      <div className="stats-card">
        <h3>Total de Entradas</h3>
        <p className="stat-value">{stats.totalEntries}</p>
      </div>
      
      <div className="stats-card">
        <h3>Entradas este Mes</h3>
        <p className="stat-value">{stats.entriesThisMonth}</p>
      </div>
      
      <div className="stats-card">
        <h3>Racha Actual</h3>
        <p className="stat-value">{stats.streakDays} días</p>
      </div>
      
      <div className="stats-card">
        <h3>Temas Principales</h3>
        <div className="top-tags">
          {stats.topTags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningStats; 