// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Projects from './pages/Projects'; // <--- Importa el nuevo componente
import ProjectEdit from './pages/ProjectEdit';

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/register">Registro</Link>
          </li>
          <li>
            <Link to="/login">Inicio de Sesión</Link>
          </li>
          <li>
            <Link to="/projects">Mis Proyectos</Link>
          </li>
          <li>
            <Link to="/projects/:id">Mis Proyectos</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectEdit />} /> 
        <Route path="/" element={<h2>Bienvenido a Novalis.ai</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
