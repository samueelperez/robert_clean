import React, { useState, useEffect } from 'react';
import { FaVideo, FaPlay } from 'react-icons/fa';
import '../styles/LearningJournal.css';

const LearningJournal = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Lista de videos del curso de trading con IDs reales de YouTube
  const tradingCourseVideos = [
    {
      id: 'video1',
      title: 'PRESENTACIÓN del Curso de ANÁLISIS TÉCNICO y TRADING',
      description: 'Introducción al curso completo de trading y análisis técnico',
      thumbnail: 'https://i.ytimg.com/vi/7I-NspXxHEE/maxresdefault.jpg',
      videoId: '7I-NspXxHEE'
    },
    {
      id: 'video2',
      title: 'Qué es el TRADING y cómo FUNCIONA',
      description: 'Conceptos básicos sobre qué es el trading y cómo funciona',
      thumbnail: 'https://i.ytimg.com/vi/Ql6GCi5Hx0E/maxresdefault.jpg',
      videoId: 'Ql6GCi5Hx0E'
    },
    {
      id: 'video3',
      title: 'Cómo EMPEZAR en el TRADING desde CERO',
      description: 'Guía para principiantes que quieren comenzar en el trading',
      thumbnail: 'https://i.ytimg.com/vi/3wO_PukhHCQ/maxresdefault.jpg',
      videoId: '3wO_PukhHCQ'
    },
    {
      id: 'video4',
      title: 'Qué son las VELAS JAPONESAS',
      description: 'Aprende a interpretar las velas japonesas en los gráficos',
      thumbnail: 'https://i.ytimg.com/vi/7I-NspXxHEE/maxresdefault.jpg',
      videoId: '7I-NspXxHEE'
    },
    {
      id: 'video5',
      title: 'PATRONES de VELAS JAPONESAS',
      description: 'Descubre los patrones más importantes de velas japonesas',
      thumbnail: 'https://i.ytimg.com/vi/Ql6GCi5Hx0E/maxresdefault.jpg',
      videoId: 'Ql6GCi5Hx0E'
    }
  ];

  // Función para reproducir un video
  const playVideo = (video) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Solución radical para el problema de scroll
  useEffect(() => {
    // Crear un estilo global que sobrescriba cualquier restricción de scroll
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      html, body, #root, .app-container, .learning-journal-wrapper {
        height: auto !important;
        min-height: 100% !important;
        max-height: none !important;
        overflow: visible !important;
        overflow-y: visible !important;
        position: static !important;
      }
      
      .learning-journal-container {
        position: relative !important;
        overflow: visible !important;
        height: auto !important;
        min-height: 100% !important;
      }
      
      * {
        overflow-anchor: none !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Desactivar cualquier manipulación de overflow en el body
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    const originalPosition = document.body.style.position;
    
    document.body.style.overflow = 'visible';
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    document.documentElement.style.overflow = 'visible';
    document.documentElement.style.height = 'auto';
    document.documentElement.style.position = 'static';
    
    // Forzar un reflow para aplicar los cambios
    const _ = document.body.offsetHeight;
    
    // Limpiar al desmontar
    return () => {
      document.head.removeChild(styleElement);
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
      document.body.style.position = originalPosition;
    };
  }, []);

  return (
    <div className="learning-journal-wrapper" style={{ overflow: 'visible', height: 'auto', minHeight: '100%' }}>
      <div className="learning-journal-container" style={{ overflow: 'visible', height: 'auto' }}>
        {/* Encabezado */}
        <div className="learning-header">
          <h1>Curso de Trading desde Cero</h1>
          <p>Aprende los fundamentos del trading con esta serie de videos</p>
        </div>

        {/* Reproductor de video principal */}
        <div className="video-player-section">
          {selectedVideo ? (
            <div className="video-player-container">
              <div className="video-player-wrapper">
                <iframe
                  className="video-player"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-info">
                <h2>{selectedVideo.title}</h2>
                <p>{selectedVideo.description}</p>
              </div>
            </div>
          ) : (
            <div className="video-player-container">
              <div className="video-player-wrapper">
                <iframe
                  className="video-player"
                  src="https://www.youtube.com/embed/7I-NspXxHEE?rel=0"
                  title="Curso de Trading desde Cero"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-info">
                <h2>Curso de Trading desde Cero</h2>
                <p>Comienza tu viaje en el mundo del trading con esta completa serie de videos</p>
              </div>
            </div>
          )}
        </div>

        {/* Lista de videos */}
        <div className="video-list-section">
          <h2>Videos del Curso</h2>
          <div className="video-grid">
            {tradingCourseVideos.map((video) => (
              <div 
                key={video.id} 
                className={`video-card ${selectedVideo && selectedVideo.id === video.id ? 'active' : ''}`}
                onClick={() => playVideo(video)}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="play-button">
                    <FaPlay />
                  </div>
                </div>
                <div className="video-card-content">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <div className="video-card-footer">
                    <span className="video-type"><FaVideo /> Video</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de lista de reproducción completa */}
        <div className="playlist-section">
          <div className="playlist-header">
            <h2>Lista de Reproducción Completa</h2>
            <p>Accede a la lista completa de videos en YouTube</p>
          </div>
          <a 
            href="https://youtube.com/playlist?list=PLxgpCi8eq8Rk8QCbnRO3w0BSuYLfS1j8n" 
            target="_blank" 
            rel="noopener noreferrer"
            className="playlist-button"
          >
            Ver Lista Completa en YouTube
          </a>
        </div>
        
        {/* Espacio adicional al final para asegurar que se pueda hacer scroll */}
        <div style={{ height: '50px' }}></div>
      </div>
    </div>
  );
};

export default LearningJournal; 