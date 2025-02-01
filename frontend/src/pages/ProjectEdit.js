// src/pages/ProjectEdit.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';         // Para la llamada a /llama/chat
import '../assets/style/editpro.css';
import logo from '../assets/imgs/logo.png';
import foto from '../assets/imgs/fotoia.png';


const ProjectEdit = () => {
  const { id } = useParams();  // ID del proyecto, tomado de la URL
  const navigate = useNavigate();

  // States para el proyecto
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [leftWidth, setLeftWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      role: 'user',
      text: chatInput.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
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
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Ocurrió un error al contactar la IA.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };  

  // States para el chat
  const [messages, setMessages] = useState([
    // Ejemplo de mensaje inicial
    { role: 'system', text: '¡Habla con tu mentor literario!' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce(async (newTitle, newContent) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        await api.put(
          `/projects/${id}`,
          { title: newTitle, content: newContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Clear message after 2 seconds
        setTimeout(() => setMessage(''), 2000);
      } catch (error) {
        setMessage(error.response?.data?.detail || 'Error al guardar');
      }
    }, 1000), // Wait 1 second after last change before saving
    [id]
  );

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
    if (title || content) {
      debouncedSave(title, content);
    }
  }, [title, content, debouncedSave]);

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
  // const handleSendChat = async (e) => {
  //   e.preventDefault();
  //   // Si el usuario no ha escrito nada, no hacer nada
  //   if (!chatInput.trim()) return;

  //   const userMessage = {
  //     role: 'user',
  //     text: chatInput.trim(),
  //   };

  //   // Añadimos el mensaje del usuario al historial
  //   setMessages((prev) => [...prev, userMessage]);
  //   // Vaciamos el input
  //   setChatInput('');

  //   try {
  //     // Llamada a nuestro endpoint local: POST /deepseek/chat
  //     const response = await axios.post('http://127.0.0.1:8000/deepseek/chat', {
  //       prompt: userMessage.text,
  //       max_length: 100,
  //       do_sample: true,
  //       temperature: 0.7,
  //     });
  //     const assistantMessage = {
  //       role: 'assistant',
  //       text: response.data.content,
  //     };

  //     // Agregamos la respuesta del modelo al historial
  //     setMessages((prev) => [...prev, assistantMessage]);
  //   } catch (error) {
  //     console.error('Error llamando a LLaMa:', error);
  //     // Opcional: Mostrar un mensaje de error en la interfaz
  //     setMessages((prev) => [
  //       ...prev,
  //       { role: 'assistant', text: 'Ocurrió un error al contactar la IA.' },
  //     ]);
  //   }
  // };
  

  return (
    <div className="containera">
      {/* SECCIÓN IZQUIERDA: Editor del Proyecto */}
      <div className="left-section" style={{ width: leftWidth }}>
        {message && <p className="message">{message}</p>}

        <div className="form-group titulogo">
          <input
            className="input borderless coso"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe tu título aquí."
          />
          <img
            src={logo}
            alt="Logo" 
            className="florcita" 
          />
        </div>

        <div className="form-group">
          <textarea
            className="textareaa input borderless"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comienza a dejar fluir tu creatividad aquí."
          />
        </div>

      </div>

      {/* DIVISOR (Draggable Splitter) */}
      <div
        className="splitter"
        onMouseDown={() => setIsDragging(true)} // Inicia el drag
      ></div>

      {/* SECCIÓN DERECHA: Chat */}
      <div className="right-section">

        {/* HISTORIAL DE MENSAJES */}
        <div className="chat-history">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`message-wrapper ${msg.role}`}
            >
              {msg.role !== 'user' && (
                <img 
                  src={foto} 
                  alt="Assistant" 
                  className="profile-pic"
                />
              )}
              <div className={`chat-message ${msg.role}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper assistant">
              <img src={foto} alt="Assistant" className="profile-pic" />
              <div className="chat-message assistant loading">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FORMULARIO PARA ENVIAR UN NUEVO MENSAJE */}
        <form onSubmit={handleSendChat} className="chat-form">
          <textarea
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="chat-input"
            rows='2'
          />
          <button type="submit" className="send-button">
            ⬆
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;