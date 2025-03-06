import React, { useState, useEffect } from 'react';
import { FaPlay, FaExternalLinkAlt, FaYoutube } from 'react-icons/fa';
import '../../styles/YouTubePlaylist.css';

const YouTubePlaylist = ({ playlistId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Datos de la lista de reproducción PLxgpCi8eq8Rk8QCbnRO3w0BSuYLfS1j8n
  // Esta es la lista "Curso de Trading desde Cero" de Rubén Vilela
  const playlistData = [
    {
      id: 'video1',
      title: 'Curso de TRADING desde CERO | Clase 1: Introducción al Trading',
      thumbnail: 'https://i.ytimg.com/vi/NhFlqFVBmxc/hqdefault.jpg',
      description: 'Introducción al mundo del trading: conceptos básicos, mercados financieros y primeros pasos.',
      videoId: 'NhFlqFVBmxc'
    },
    {
      id: 'video2',
      title: 'Curso de TRADING desde CERO | Clase 2: Análisis Técnico',
      thumbnail: 'https://i.ytimg.com/vi/CObBVEjXKMU/hqdefault.jpg',
      description: 'Fundamentos del análisis técnico: gráficos, tendencias, soportes y resistencias.',
      videoId: 'CObBVEjXKMU'
    },
    {
      id: 'video3',
      title: 'Curso de TRADING desde CERO | Clase 3: Indicadores Técnicos',
      thumbnail: 'https://i.ytimg.com/vi/Gy5SXK3pQpc/hqdefault.jpg',
      description: 'Principales indicadores técnicos y cómo utilizarlos en tu análisis de mercado.',
      videoId: 'Gy5SXK3pQpc'
    },
    {
      id: 'video4',
      title: 'Curso de TRADING desde CERO | Clase 4: Patrones de Velas',
      thumbnail: 'https://i.ytimg.com/vi/Qr3RiEQhz5E/hqdefault.jpg',
      description: 'Patrones de velas japonesas y cómo interpretarlos para tomar decisiones de trading.',
      videoId: 'Qr3RiEQhz5E'
    },
    {
      id: 'video5',
      title: 'Curso de TRADING desde CERO | Clase 5: Gestión Monetaria',
      thumbnail: 'https://i.ytimg.com/vi/Ue9dcbv1BIU/hqdefault.jpg',
      description: 'Estrategias de gestión monetaria para proteger tu capital y maximizar ganancias.',
      videoId: 'Ue9dcbv1BIU'
    },
    {
      id: 'video6',
      title: 'Curso de TRADING desde CERO | Clase 6: Psicología del Trading',
      thumbnail: 'https://i.ytimg.com/vi/Ue9dcbv1BIU/hqdefault.jpg',
      description: 'Aspectos psicológicos del trading y cómo mantener una mentalidad ganadora.',
      videoId: 'Ue9dcbv1BIU'
    },
    {
      id: 'video7',
      title: 'Curso de TRADING desde CERO | Clase 7: Estrategias de Trading',
      thumbnail: 'https://i.ytimg.com/vi/Ue9dcbv1BIU/hqdefault.jpg',
      description: 'Diferentes estrategias de trading y cómo implementarlas en tus operaciones.',
      videoId: 'Ue9dcbv1BIU'
    }
  ];

  useEffect(() => {
    // Simulamos la carga de datos
    setTimeout(() => {
      setVideos(playlistData);
      setLoading(false);
    }, 1000);
    
    // En un entorno de producción, podrías usar la API de YouTube
    // const fetchPlaylistVideos = async () => {
    //   try {
    //     const API_KEY = 'TU_API_KEY';
    //     const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`);
    //     const data = await response.json();
    //     
    //     const formattedVideos = data.items.map(item => ({
    //       id: item.id,
    //       title: item.snippet.title,
    //       thumbnail: item.snippet.thumbnails.medium.url,
    //       description: item.snippet.description,
    //       videoId: item.snippet.resourceId.videoId
    //     }));
    //     
    //     setVideos(formattedVideos);
    //   } catch (error) {
    //     console.error('Error fetching playlist:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // 
    // fetchPlaylistVideos();
  }, [playlistId]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const openYouTubePlaylist = () => {
    window.open(`https://www.youtube.com/playlist?list=${playlistId}`, '_blank');
  };

  const openYouTubeVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="youtube-playlist-loading">
        <div className="loading-spinner"></div>
        <p>Cargando videos...</p>
      </div>
    );
  }

  return (
    <div className="youtube-playlist-container">
      <div className="playlist-header">
        <h3>Curso de Trading desde Cero - Rubén Vilela</h3>
        <button className="view-on-youtube" onClick={openYouTubePlaylist}>
          Ver en YouTube <FaExternalLinkAlt />
        </button>
      </div>

      <div className="playlist-content">
        <div className="video-list">
          {videos.map(video => (
            <div 
              key={video.id} 
              className={`video-item ${selectedVideo === video ? 'selected' : ''}`}
              onClick={() => openYouTubeVideo(video.videoId)}
            >
              <div className="video-thumbnail">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/120x68?text=Video';
                  }}
                />
                <div className="play-icon">
                  <FaPlay />
                </div>
              </div>
              <div className="video-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="video-player">
          <div className="player-placeholder">
            <div className="placeholder-content">
              <FaYoutube className="placeholder-icon" style={{ color: '#FF0000', fontSize: '4rem' }} />
              <p>Haz clic en cualquier video para verlo en YouTube</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlaylist; 