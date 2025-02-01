// src/pages/Login.js
import React, { useRef, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../assets/style/login.css';
import logo from '../assets/imgs/logo.png';

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

  const handleRegClick = () => {
    navigate('/register');
  };

  return (
    <div className="page-container">

      {/* Botón para controlar la música */}
      {/* <button
        onClick={handleMusicToggle}
        className="music-button"
        aria-label={isPlaying ? 'Pausar Música' : 'Reproducir Música'}
      >
        {isPlaying ? '🎵 Pausar Música' : '🎶 Reproducir Música'}
      </button>

      {/* Audio oculto en pantalla, con loop */}
      {/* <audio ref={audioRef} src="/landing_tune.mp3" loop /> */} 

      {/* Tarjeta con el formulario de login */}
      <div className="card">
        <h2 className="heading">Inicio de Sesión</h2>

        <form onSubmit={handleLogin}>
                    <div className="form-group">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="Contraseña"
            />
          </div>

          <button type="submit" className="submit-button">
            Iniciar Sesión
          </button>
        </form>
        <div className='textoabajo'>
          <p >Don't have an account?</p>
          <p className='registro' onClick={handleRegClick}>Register here</p>
        </div>
        {message && <p className="message">{message}</p>}

        {/* Opcional: mostrar un mensaje si el autoplay fue bloqueado */}
        {/* {autoPlayError && (
          <p className="info-message">
            Por favor, haz clic en "Reproducir Música" para escuchar la música.
          </p>
        )} */}
      </div>
      <img
        src={logo}
        alt="Logo" 
        className="logosi" 
      />
    </div>
  );
};

export default Login;