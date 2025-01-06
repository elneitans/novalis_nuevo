// src/pages/Landing.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Al montar el componente, removemos márgenes y padding 
    // de html y body, y evitamos scroll
    document.documentElement.style.margin = 0;
    document.documentElement.style.padding = 0;
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.overflow = 'hidden';

    // Cuando se desmonte, restauramos
    return () => {
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Función para ir al login al hacer clic en el logo
  const handleLogoClick = () => {
    navigate('/login');
  };

  // Estilos en línea
  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      // Fondo: ruta absoluta a stars3.jpg en /public
      background: 'url("/stars3.jpg") center center no-repeat',
      backgroundSize: 'cover',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      cursor: 'pointer',
      maxWidth: '300px', // Ajusta el tamaño que prefieras
      width: '100%',
      height: 'auto',
    },
  };

  return (
    <div style={styles.container}>
      <img 
        src="/logo1.png" 
        alt="Logo" 
        style={styles.logo} 
        onClick={handleLogoClick}
      />
    </div>
  );
}

export default Landing;