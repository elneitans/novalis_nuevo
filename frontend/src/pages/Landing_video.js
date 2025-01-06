// src/pages/Landing.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  // Función que se ejecuta cuando el video termina
  const handleVideoEnded = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Video a pantalla completa */}
      <video 
        src="/landing_flower2.mp4"
        style={styles.fullscreenVideo}
        autoPlay
        onEnded={handleVideoEnded}
      />
    </div>
  );
}

// Estilos inline para simplicidad. Se recomienda usar CSS externo o una librería de estilos.
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000', // Color de fondo por si el video no carga
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Asegura que el video cubra toda la pantalla sin distorsión
  },
  textOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para mejor legibilidad
    padding: '20px',
    borderRadius: '10px',
  },
  title: {
    fontSize: '48px',
    margin: '0 0 20px 0',
  },
  subtitle: {
    fontSize: '24px',
    margin: '0 0 30px 0',
  },
  ctaButton: {
    padding: '15px 30px',
    backgroundColor: '#ff5722',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    transition: 'background-color 0.3s ease',
  },
};

export default Landing;