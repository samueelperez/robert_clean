import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt, FaCalculator, FaChartPie, FaChartLine, FaBook, FaGraduationCap, FaWallet } from 'react-icons/fa';
import '../../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // No mostrar la navbar en la página de inicio
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo" onClick={closeMenu}>
          Trading Journal
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink 
              to="/portfolio" 
              className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <FaWallet className="nav-icon" /> Portfolio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <FaChartLine className="nav-icon" /> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/diario" 
              className={`nav-link ${location.pathname === '/diario' ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <FaBook className="nav-icon" /> Diario
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/aprendizaje" 
              className={`nav-link ${location.pathname === '/aprendizaje' ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <FaGraduationCap className="nav-icon" /> Aprendizaje
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/calculadora" 
              className={`nav-link ${location.pathname === '/calculadora' ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              <FaCalculator className="nav-icon" /> Calculadora
            </NavLink>
          </li>
        </ul>

        <div className="user-menu">
          <div className="user-avatar" onClick={toggleDropdown}>
            <FaUser />
          </div>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/settings" className="dropdown-item">
                <FaCog /> Configuración
              </Link>
              <button className="dropdown-item">
                <FaSignOutAlt /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 