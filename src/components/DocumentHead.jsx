import { useEffect } from 'react';

const DocumentHead = ({ title, description, meta = [] }) => {
  useEffect(() => {
    // Actualizar título
    if (title) {
      document.title = title;
    }
    
    // Actualizar descripción
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }
    
    // Actualizar otros meta tags
    const metaTags = [];
    meta.forEach(({ name, content }) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = name;
        document.head.appendChild(metaTag);
        metaTags.push(metaTag);
      }
      metaTag.content = content;
    });
    
    // Limpieza
    return () => {
      metaTags.forEach(tag => {
        document.head.removeChild(tag);
      });
    };
  }, [title, description, meta]);
  
  return null;
};

export default DocumentHead; 