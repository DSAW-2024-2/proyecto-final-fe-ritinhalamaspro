
import React from 'react';

import Button from '../components/Button';
import logo from '../assets/logo.png';
import './LandingPageStyles.css'; 

const LandingPage = () => {
  return (
    <div className="inicial-container">
      <img src={logo} alt="Logo" className="logo" />
      <Button to="/iniciar-sesion" label="Iniciar Sesión" primary />
      <Button to="/registrarse" label="Registrarse" />
    </div>
  );
};

export default LandingPage;
