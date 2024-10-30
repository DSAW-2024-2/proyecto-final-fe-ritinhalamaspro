import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/common/CommonStyles';

// Estilos con styled-components
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
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/pagina-principal');
    }
  }
  , []);

  return (
    <Container>
      <Logo src={logo} alt="Logo" />
      <StyledButton to="/iniciar-sesion" label="Iniciar Sesión" primary />
      <StyledButton to="/registrarse" label="Registrarse" />
    </Container>
  );
};

export default LandingPage;
