import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

const VideoList = () => {
  // Estado para almacenar los videos y su estado (visto/no visto)
  const [videos, setVideos] = useState(() => {
    // Intentar cargar videos guardados del localStorage
    const savedVideos = localStorage.getItem('learningVideos');
    return savedVideos ? JSON.parse(savedVideos) : [
      {
        id: '1',
        title: 'Introducción al Análisis Técnico',
        description: 'Aprende los fundamentos del análisis técnico para trading.',
        youtubeId: 'dQw4w9WgXcQ', // Reemplazar con ID real de YouTube
        watched: false
      },
      {
        id: '2',
        title: 'Patrones de Velas Japonesas',
        description: 'Guía completa sobre los patrones de velas japonesas más efectivos.',
        youtubeId: 'xvFZjo5PgG0', // Reemplazar con ID real de YouTube
        watched: false
      },
      {
        id: '3',
        title: 'Estrategias de Gestión de Riesgo',
        description: 'Cómo implementar una gestión de riesgo efectiva en tus operaciones.',
        youtubeId: 'xvFZjo5PgG0', // Reemplazar con ID real de YouTube
        watched: false
      },
      {
        id: '4',
        title: 'Psicología del Trading',
        description: 'Supera los obstáculos mentales que afectan tu rendimiento.',
        youtubeId: 'dQw4w9WgXcQ', // Reemplazar con ID real de YouTube
        watched: false
      },
      {
        id: '5',
        title: 'Análisis Fundamental para Traders',
        description: 'Cómo los eventos económicos afectan a los mercados financieros.',
        youtubeId: 'xvFZjo5PgG0', // Reemplazar con ID real de YouTube
        watched: false
      }
    ];
  });

  // Estado para el video actualmente reproduciendo
  const [playingVideo, setPlayingVideo] = useState(null);

  // Guardar videos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('learningVideos', JSON.stringify(videos));
  }, [videos]);

  // Función para marcar un video como visto/no visto
  const toggleWatched = (id) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, watched: !video.watched } : video
    ));
  };

  // Calcular progreso
  const watchedCount = videos.filter(video => video.watched).length;
  const progress = Math.round((watchedCount / videos.length) * 100);

  return (
    <div className="video-list-container">
      <div className="progress-bar-container">
        <div className="progress-info">
          <h3>Tu Progreso</h3>
          <span>{watchedCount} de {videos.length} videos ({progress}%)</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {playingVideo && (
        <div className="video-player-modal">
          <div className="video-player-container">
            <button className="close-button" onClick={() => setPlayingVideo(null)}>×</button>
            <VideoPlayer videoId={playingVideo.youtubeId} title={playingVideo.title} />
          </div>
        </div>
      )}

      <div className="video-list">
        {videos.map(video => (
          <div key={video.id} className={`video-card ${video.watched ? 'watched' : ''}`}>
            <div className="video-thumbnail" onClick={() => setPlayingVideo(video)}>
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                alt={video.title} 
              />
              <div className="play-button">▶</div>
            </div>
            
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              
              <div className="video-actions">
                <a 
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="watch-button"
                >
                  Ver Video
                </a>
                
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={video.watched} 
                    onChange={() => toggleWatched(video.id)} 
                  />
                  <span className="checkmark"></span>
                  {video.watched ? 'Completado' : 'Marcar como visto'}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList; 