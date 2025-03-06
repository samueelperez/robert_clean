import React from 'react';

const LearningEntryList = () => {
  // Datos de ejemplo
  const entries = [
    {
      id: '1',
      date: '2023-03-01',
      title: 'Análisis de patrones de velas',
      content: 'Hoy aprendí sobre los patrones de velas japonesas...',
      tags: ['technical-analysis', 'candlesticks']
    },
    {
      id: '2',
      date: '2023-03-02',
      title: 'Gestión del riesgo',
      content: 'Estudié diferentes estrategias de gestión del riesgo...',
      tags: ['risk-management', 'psychology']
    }
  ];

  return (
    <div className="learning-entry-list">
      <h3>Entradas Recientes</h3>
      
      {entries.length === 0 ? (
        <p>No hay entradas de aprendizaje registradas.</p>
      ) : (
        entries.map(entry => (
          <div key={entry.id} className="learning-entry-card">
            <div className="entry-header">
              <h4>{entry.title}</h4>
              <span className="entry-date">{entry.date}</span>
            </div>
            <p className="entry-content">{entry.content}</p>
            <div className="entry-tags">
              {entry.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LearningEntryList; 