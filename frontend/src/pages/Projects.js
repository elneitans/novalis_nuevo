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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Obtener el token almacenado en localStorage al hacer login.
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No estás autenticado');
          return;
        }

        // Hacer solicitud GET a /projects con cabecera Authorization
        const response = await api.get('/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(response.data); // Asigna los proyectos al state
      } catch (error) {
        // Si el servidor respondió con un error, capturarlo
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

      // POST /projects
      const response = await api.post(
        '/projects',
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Agregar el nuevo proyecto al array local de proyectos
      setProjects([...projects, response.data]);

      // Limpiar campos
      setTitle('');
      setContent('');
      navigate(`/projects/${response.data.id}`);

    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error al crear proyecto');
    }
  };
  
  const navigate = useNavigate();

  return (
    
    
    <div className="projects-container">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=docs_add_on" />
      <p className='nombre'>blueflowers.</p>

      <div className='flexito'>
        <h2 className="projects-title">Mis Proyectos</h2>
        <img
          src={logo}
          alt="Logo" 
          className="florcita2" 
        />
      </div>
      

      {message && <p className="message">{message}</p>}
      <div className='newpro' onClick={handleCreateProject}>
        <span class="material-symbols-outlined">docs_add_on</span>
        <h3 className='nuev'>Nuevo proyecto</h3>
      </div>
      {/* <form onSubmit={handleCreateProject} className="project-form">
        <div className="form-group">
          <label>Título del proyecto:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contenido (opcional):</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">Crear Proyecto</button>
      </form> */}

      <ul className="projects-list">
        {projects.map((proj) => (
          <li key={proj.id} className="project-item">
            <div>
              <strong>{proj.title}</strong> - {proj.content}
            </div>
            <button 
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="edit-button"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Projects;
