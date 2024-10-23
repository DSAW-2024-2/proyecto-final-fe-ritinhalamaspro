import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import logo from '../assets/logo.png';

// Componente estilizado
const InicialContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
`;

const Logo = styled.img`
  width: 150px; 
  margin-bottom: 40px;
`;

const StyledButton = styled(Button)`
  margin: 10px 0; 
`;

const LandingPage = () => {
  return (
    <InicialContainer>
      <Logo src={logo} alt="Logo" />
      <StyledButton to="/iniciar-sesion" label="Iniciar Sesión" primary />
      <StyledButton to="/registrarse" label="Registrarse" />
    </InicialContainer>
  );
};

export default LandingPage;
