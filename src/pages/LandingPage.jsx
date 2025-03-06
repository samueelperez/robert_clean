import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../styles/LandingPage.css';

// Importar las imágenes locales
import primeraImg from '../assets/images/primera.jpg';
import segundaImg from '../assets/images/segunda.jpg';
import terceraImg from '../assets/images/tercera.jpg';

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Array de imágenes de fondo (usando las imágenes locales)
  const backgroundImages = [
    primeraImg,
    segundaImg,
    terceraImg
  ];

  // Efecto para cambiar la imagen de fondo cada 6 segundos
  useEffect(() => {
    const transitionInterval = 6000; // 6 segundos entre transiciones
    
    const intervalId = setInterval(() => {
      // Iniciar transición
      setIsTransitioning(true);
      
      // Después de 1 segundo (duración de la transición), actualizar los índices
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 1000);
    }, transitionInterval);

    // Prevenir el scroll y eliminar márgenes
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      clearInterval(intervalId);
      // Restaurar el scroll cuando el componente se desmonte
      document.body.style.overflow = 'auto';
    };
  }, [nextImageIndex, backgroundImages.length]);

  return (
    <div className="landing-page-fullscreen">
      {/* Hero Section con Imágenes de Fondo */}
      <section className="hero-fullscreen">
        {/* Capa de imagen actual (siempre visible) */}
        <div 
          className="background-image current-image"
          style={{ 
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100vw',
            height: '100vh'
          }}
        ></div>
        
        {/* Capa de imagen siguiente (aparece durante la transición) */}
        <div 
          className={`background-image next-image ${isTransitioning ? 'fade-in' : ''}`}
          style={{ 
            backgroundImage: `url(${backgroundImages[nextImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100vw',
            height: '100vh'
          }}
        ></div>
        
        <div className="overlay"></div>
        
        <div className="hero-content-centered">
          <div className="hero-text-container">
            <div className="vertical-line"></div>
            <div className="hero-text">
              <h1 className="hero-title-large">
                TRADING
                <br />
                JOURNAL
                <br />
                PRO
              </h1>
              <p className="hero-subtitle-large">
                Registra, analiza y optimiza tus operaciones
              </p>
              <div className="hero-buttons-centered">
                <Link to="/dashboard" className="hero-button-primary">
                  Comenzar Ahora <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logos o badges en la parte inferior */}
        <div className="bottom-badges">
          <div className="badge">
            <span className="badge-text">10k+ Traders</span>
          </div>
          <div className="badge">
            <span className="badge-text">1M+ Operaciones</span>
          </div>
          <div className="badge">
            <span className="badge-text">98% Satisfacción</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 