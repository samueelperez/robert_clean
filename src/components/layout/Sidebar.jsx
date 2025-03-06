import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" end>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/trades">Diario de Operaciones</NavLink>
        </li>
        <li>
          <NavLink to="/performance">Análisis de Rendimiento</NavLink>
        </li>
        <li>
          <NavLink to="/learning">Diario de Aprendizaje</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; 