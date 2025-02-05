import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../assets/style/projects.css';
import logo from '../assets/imgs/logo.png';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No estás autenticado');
          return;
        }
        const response = await api.get('/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        if (error.response && error.response.data) {
          setMessage(error.response.data.detail || 'Error al obtener proyectos');
        } else {
          setMessage('Ocurrió un error al obtener proyectos');
        }
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No estás autenticado');
        return;
      }
      // POST /projects para crear un nuevo proyecto.
      const response = await api.post(
        '/projects',
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Se agrega el nuevo proyecto al state local.
      setProjects([...projects, response.data]);
      // Limpiar los campos.
      setTitle('');
      setContent('');
      // Navegar al editor del proyecto recién creado.
      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error al crear proyecto');
    }
  };

  return (
    <div className="projects-container">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=docs_add_on"
      />
      <p className="nombre">blueflowers.</p>

      <div className="flexito">
        <h2 className="projects-title">Mis Proyectos</h2>
        <img src={logo} alt="Logo" className="florcita2" />
      </div>

      {message && <p className="message">{message}</p>}

      <div className="newpro" onClick={handleCreateProject}>
        <span className="material-symbols-outlined">docs_add_on</span>
        <h3 className="nuev">Nuevo proyecto</h3>
      </div>

      <ul className="projects-list">
        {projects.map((proj) => (
          <li key={proj.id} className="project-item">
            <div>
              {/* El título es clicable y navega al editor */}
              <strong
                onClick={() => navigate(`/projects/${proj.id}`)}
                className="project-title"
                style={{ cursor: 'pointer' }}
              >
                {proj.title}
              </strong>
              {/* Se muestra la fecha de última edición formateada.
                  Asegúrate de que 'updatedAt' exista en cada objeto de proyecto. */}
              <span className="last-edited">
                {proj.updated_at
                  ? new Date(proj.updated_at).toLocaleDateString()
                  : ''}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;