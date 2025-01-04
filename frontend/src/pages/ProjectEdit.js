// src/pages/ProjectEdit.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';         // Para la llamada a /llama/chat

const ProjectEdit = () => {
  const { id } = useParams();  // ID del proyecto, tomado de la URL
  const navigate = useNavigate();

  // States para el proyecto
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [leftWidth, setLeftWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);

  // States para el chat
  const [messages, setMessages] = useState([
    // Ejemplo de mensaje inicial
    { role: 'system', text: '¡Habla con tu mentor literario!' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Al montar, obtener datos del proyecto
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No estás autenticado');
          return;
        }

        // GET /projects/:id
        const response = await api.get(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const proj = response.data;
        setTitle(proj.title);
        setContent(proj.content || '');
      } catch (error) {
        setMessage(error.response?.data?.detail || 'Error al obtener el proyecto');
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    // Cuando el usuario está arrastrando, conecta los eventos globales
    const handleDrag = (e) => {
      if (!isDragging) return;
      const newLeftWidth = e.clientX;
      if (newLeftWidth > 200 && newLeftWidth < window.innerWidth - 200) {
        setLeftWidth(newLeftWidth);
      }
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', stopDragging);

    // Cleanup de eventos al desmontar el componente o al finalizar el drag
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [isDragging]); // Solo se ejecuta cuando `isDragging` cambia


  // Manejo de guardado (PUT)
  // Guardar cambios del proyecto (PUT)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No estás autenticado');
        return;
      }
      await api.put(
        `/projects/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Proyecto guardado con éxito');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error al guardar el proyecto');
    }
  };

  // Manejo del chat con IA al enviar un mensaje
  const handleSendChat = async (e) => {
    e.preventDefault();
    // Si el usuario no ha escrito nada, no hacer nada
    if (!chatInput.trim()) return;

    const userMessage = {
      role: 'user',
      text: chatInput.trim(),
    };

    // Añadimos el mensaje del usuario al historial
    setMessages((prev) => [...prev, userMessage]);
    // Vaciamos el input
    setChatInput('');

    try {
      // Llamada a nuestro endpoint local: POST /deepseek/chat
      const response = await axios.post('http://127.0.0.1:8000/deepseek/chat', {
        prompt: userMessage.text,
        max_length: 100,
        do_sample: true,
        temperature: 0.7,
      });
      const assistantMessage = {
        role: 'assistant',
        text: response.data.content,
      };

      // Agregamos la respuesta del modelo al historial
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error llamando a LLaMa:', error);
      // Opcional: Mostrar un mensaje de error en la interfaz
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Ocurrió un error al contactar la IA.' },
      ]);
    }
  };

  return (
    <div style={{ display: 'flex', height: '90vh', fontFamily: 'Roboto, sans-serif' }}>
      {/* SECCIÓN IZQUIERDA: Editor del Proyecto */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Editar Proyecto</h2>
        {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '.5rem' }}>Título:</label>
          <input
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '.5rem' }}>Contenido:</label>
          <textarea
            style={{
              width: '100%',
              height: '60vh',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              resize: 'none',
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginRight: '1rem',
            }}
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => navigate('/projects')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Volver a mis proyectos
          </button>
        </div>
      </div>

      {/* DIVISOR (Draggable Splitter) */}
      <div
        style={{
          width: '5px',
          cursor: 'col-resize',
          backgroundColor: '#ccc',
        }}
        onMouseDown={() => setIsDragging(true)} // Inicia el drag
      ></div>

      {/* SECCIÓN DERECHA: Chat */}
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <h2>Chat con DeepSeek</h2>

        {/* HISTORIAL DE MENSAJES */}
        <div
          style={{
            flex: 1,
            border: '1px solid #ccc',
            padding: '1rem',
            overflowY: 'auto',
            marginBottom: '1rem',
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <strong>
                {msg.role === 'user'
                  ? 'Tú'
                  : msg.role === 'assistant'
                  ? 'Deepseek'
                  : 'Sistema'}
                :
              </strong>{' '}
              {msg.text}
            </div>
          ))}
        </div>

        {/* FORMULARIO PARA ENVIAR UN NUEVO MENSAJE */}
        <form onSubmit={handleSendChat} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            style={{ flex: 1, marginRight: '1rem' }}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;
