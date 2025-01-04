// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Projects from './pages/Projects'; // <--- Importa el nuevo componente
import ProjectEdit from './pages/ProjectEdit';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
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

        <main className="content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectEdit />} />
            <Route
              path="/"
              element={
                <div className="hero">
                  <h2>Bienvenido a Novalis.ai</h2>
                  <p>Descubre y edita tus proyectos de forma sencilla.</p>
                  <Link to="/register" className="cta-button">
                    Comienza Ahora
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
