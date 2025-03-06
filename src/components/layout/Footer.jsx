import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  // No mostrar el footer en la página de inicio
  if (window.location.pathname === '/') {
    return null;
  }
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Trading Journal. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer; 