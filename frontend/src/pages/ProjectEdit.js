// src/pages/ProjectEdit.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import '../assets/style/editpro.css';
import logo from '../assets/imgs/logo.png';
import foto from '../assets/imgs/fotoia.png';

const ProjectEdit = () => {
  const { id } = useParams();

  // Estados del proyecto
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  // Estado para controlar la visibilidad del chat
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Estado del historial de chat.
  // El historial inicial contiene el mensaje del sistema.
  const [messages, setMessages] = useState([
    { role: 'system', text: '¡Habla con tu mentor literario!' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Función para enviar mensaje en el chat, incluyendo el historial completo.
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Se crea el mensaje del usuario y se actualiza el historial.
    const userMessage = { role: 'user', text: chatInput.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatInput('');
    setIsLoading(true);

    try {
      // Se transforma el historial al formato que espera la API:
      // cada mensaje con { role, content } en lugar de { role, text }.
      const payload = {
        messages: updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.text,
        })),
      };

      const response = await axios.post('http://127.0.0.1:8000/deepseek/chat', payload);
      const assistantMessage = { role: 'assistant', text: response.data.content };

      // Se agrega la respuesta del asistente al historial.
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

  // Función debounce para guardar cambios automáticamente
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

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
        setTimeout(() => setMessage(''), 2000);
      } catch (error) {
        setMessage(error.response?.data?.detail || 'Error al guardar');
      }
    }, 1000),
    [id]
  );

  // Obtener datos del proyecto al montar el componente
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No estás autenticado');
          return;
        }
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

  // Guardar cambios automáticamente
  useEffect(() => {
    if (title || content) {
      debouncedSave(title, content);
    }
  }, [title, content, debouncedSave]);

  // Función para alternar la visibilidad del chat
  const toggleChat = () => {
    setIsChatVisible((prev) => !prev);
  };

  // (Opcional) Función para guardar manualmente el proyecto
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

  return (
    <div className="containera">
      {/* Panel de edición: ocupa 100% si el chat está oculto o 50% si está visible */}
      <div className="left-section" style={{ width: isChatVisible ? '50%' : '100%' }}>
        {message && <p className="message">{message}</p>}
        <div className="form-group titulogo">
          <input
            className="input borderless coso"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe tu título aquí."
          />
          <img src={logo} alt="Logo" className="florcita" />
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

      {/* División con el botón de toggle (ubicado en el centro) */}
      <div className="divider">
        <button onClick={toggleChat} className="toggle-chat-button">
          <span className="triangle">{isChatVisible ? '▶' : '◀'}</span>
        </button>
      </div>

      {/* Panel de chat, solo se renderiza si está visible */}
      {isChatVisible && (
        <div className="right-section" style={{ width: '50%' }}>
          <div className="chat-history">
            {messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                {msg.role !== 'user' && (
                  <img src={foto} alt="Assistant" className="profile-pic" />
                )}
                <div className={`chat-message ${msg.role}`}>{msg.text}</div>
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

          <form onSubmit={handleSendChat} className="chat-form">
            <textarea
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="chat-input"
              rows="2"
            />
            <button type="submit" className="send-button">
              ⬆
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectEdit;