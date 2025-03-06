import React, { useState } from 'react';

const VideoPlayer = ({ videoId, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!isPlaying) {
    return (
      <div className="video-player-placeholder" onClick={() => setIsPlaying(true)}>
        <img 
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
          alt={title} 
        />
        <div className="play-overlay">
          <div className="play-icon">▶</div>
          <div className="play-text">Reproducir video</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="video-player">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer; 