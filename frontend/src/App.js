// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Projects from './pages/Projects';
import ProjectEdit from './pages/ProjectEdit';
import './App.css';

// Componente que maneja la lógica de renderizado del Header
const AppContent = () => {
  const location = useLocation();

  // Define las rutas donde deseas ocultar el Header
  const hideHeaderRoutes = ['/', '/login']; // Aquí, '/' corresponde a la ruta de Landing

  // Determina si el Header debe ocultarse
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="container">
      {/* Renderiza el Header solo si no está en una ruta que lo oculte */}
      {!shouldHideHeader && (
        <header className="navbar">
          <h1 className="logo">Novalis</h1>
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/register">Registro</Link>
              </li>
              <li>
                <Link to="/login">Inicio de Sesión</Link>
              </li>
              <li>
                <Link to="/projects">Mis Proyectos</Link>
              </li>
            </ul>
          </nav>
        </header>
      )}

      <main className="content">
        <Routes>
          {/* Ruta para la página de Landing */}
          <Route path="/" element={<Landing />} />

          {/* Otras rutas */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectEdit />} />

          {/* Si deseas agregar una ruta de error 404 o redireccionamiento, puedes hacerlo aquí */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;