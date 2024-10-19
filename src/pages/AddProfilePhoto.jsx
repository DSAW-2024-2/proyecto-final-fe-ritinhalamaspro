import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import ProfilePhoto from '../components/ProfilePhoto';
import AddButton from '../components/AddButton';
import { Link } from 'react-router-dom';
import colors from '../components/colors'; // Importamos el archivo de colores

const Login = () => {
  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: colors.white, // Usamos la variable de color para el texto
  };

  const paragraphStyle = {
    textAlign: 'center',
    marginTop: '20px',
    color: colors.white, // Usamos la variable de color para el texto
  };

  const linkStyle = {
    color: colors.third, // Usamos la variable de color para el enlace
    textDecoration: 'underline',
    cursor: 'pointer',
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)',
  };

  const profileContainerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '20px',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>Agrega tu foto</Title>
        <form>
          <div style={profileContainerStyle}>
            <ProfilePhoto
              imageUrl="src/assets/PofilePhoto.png"
              size="170px"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button to="/rol" label="¡Listo!" primary />
          </div>
        </form>
        <Text>
          <Link to="/rol" style={linkStyle}>Omitir</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
