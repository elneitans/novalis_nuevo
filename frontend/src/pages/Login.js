// src/pages/Login.js
import React, { useRef, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  // Audio
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayError, setAutoPlayError] = useState(false);

  // Intentar reproducir el audio automáticamente al montar
  useEffect(() => {
    if (audioRef.current) {
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.warn('Autoplay bloqueado:', error);
          setAutoPlayError(true);
        }
      };
      playAudio();
    }
  }, []);

  const handleMusicToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .catch((error) => {
          console.warn('Error al reproducir el audio:', error);
          setAutoPlayError(true);
        });
      setIsPlaying(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      setMessage('Inicio de sesión exitoso.');
      // Redirigir a /projects
      navigate('/projects');
    } catch (error) {
      setMessage(
        error.response?.data?.detail || 'Error en el inicio de sesión.'
      );
    }
  };

  // Estilos en línea
  const styles = {
    pageContainer: {
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000', // Fondo negro
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontFamily: 'sans-serif',
    },
    card: {
      backgroundColor: '#1A1A1A',
      borderRadius: '8px',
      padding: '2rem',
      width: '350px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    heading: {
      fontSize: '1.25rem',
      marginBottom: '1.5rem',
      fontWeight: '500',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: '0.25rem',
      fontSize: '0.9rem',
      color: '#cccccc',
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #333333',
      borderRadius: '4px',
      backgroundColor: '#2c2c2c',
      color: '#ffffff',
      fontSize: '0.95rem',
      outline: 'none',
    },
    submitButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#ffffff',
      color: '#000000',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    message: {
      marginTop: '1rem',
      color: '#ffcccc', // Rojo suave si hay error, ajústalo según gusto
      textAlign: 'center',
    },
    infoMessage: {
      marginTop: '1rem',
      fontSize: '0.85rem',
      color: '#aaaaaa',
      textAlign: 'center',
    },
    musicButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#000',
    },
  };

  return (
    <div style={styles.pageContainer}>

      {/* Botón para controlar la música */}
      <button
        onClick={handleMusicToggle}
        style={styles.musicButton}
        aria-label={isPlaying ? 'Pausar Música' : 'Reproducir Música'}
      >
        {isPlaying ? '🎵 Pausar Música' : '🎶 Reproducir Música'}
      </button>

      {/* Audio oculto en pantalla, con loop */}
      <audio ref={audioRef} src="/landing_tune.mp3" loop />

      {/* Tarjeta con el formulario de login */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Inicio de Sesión</h2>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Contraseña:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Iniciar Sesión
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        {/* Opcional: mostrar un mensaje si el autoplay fue bloqueado */}
        {autoPlayError && (
          <p style={styles.infoMessage}>
            Por favor, haz clic en "Reproducir Música" para escuchar la música.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;