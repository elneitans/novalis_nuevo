// src/pages/Landing.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/style/landing.css';
import logo from '../assets/imgs/logo.png';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.margin = 0;
    document.documentElement.style.padding = 0;
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.overflow = 'hidden';

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

  return (
    <>
      <div className='ambos'>
        <p className='nombre'>blueflowers.</p>
        <p className='parrafo'>
          Poetry heals the wounds inflicted by reason.<br></br>                          
          The artist stands upon the human spirit like a statue upon its pedestal. <br></br>                     
          Let us devote ourselves to the pursuit of creative expression, for within each of us lies an artist waiting to bloom.
        </p>
      </div>
      <div className="container">
        <img
          src={logo}
          alt="Logo" 
          className="logo" 
          onClick={handleLogoClick}
        />
      </div>
    </>
  );
}

export default Landing;