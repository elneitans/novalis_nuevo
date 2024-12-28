import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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
      setMessage('Proyecto creado exitosamente');

    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error al crear proyecto');
    }
  };
  
  const navigate = useNavigate();

  return (
    <div>
      <h2>Mis Proyectos</h2>

      {/* Mostrar mensajes si los hay */}
      {message && <p>{message}</p>}

      {/* Formulario para crear nuevo proyecto */}
      <form onSubmit={handleCreateProject}>
        <div>
          <label>Título del proyecto:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contenido (opcional):</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit">Crear Proyecto</button>
      </form>

      {/* Lista de proyectos */}
      <ul>
        {projects.map((proj) => (
          <li key={proj.id}>
            <strong>{proj.title}</strong> - {proj.content}
            {/* Botón o enlace para editar */}
            <button onClick={() => navigate(`/projects/${proj.id}`)}>
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Projects;
