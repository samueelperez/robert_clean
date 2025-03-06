import React, { useState } from 'react';

const LearningEntryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la entrada
    console.log('Formulario enviado:', formData);
    // Resetear el formulario
    setFormData({ title: '', content: '', tags: [] });
  };

  return (
    <div className="learning-entry-form">
      <h3>Nueva Entrada de Aprendizaje</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Contenido</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Etiquetas (separadas por comas)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" className="btn-primary">Guardar Entrada</button>
      </form>
    </div>
  );
};

export default LearningEntryForm; 