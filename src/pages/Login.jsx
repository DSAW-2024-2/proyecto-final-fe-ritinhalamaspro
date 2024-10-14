import React from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import { Link } from 'react-router-dom';

const Login = () => {
  const headingStyle = {
    textAlign: 'center',
    marginBottom: '80px', 
    fontSize: '24px',
    color: 'white',
  };


  const linkStyle = {
    color: '#D130FE',
    textDecoration: 'underline', 
    cursor: 'pointer',   
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)'         
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title style={headingStyle}>Inicia Sesión</Title> 
        <form style={{formStyle}}>
          <InputField type="email" placeholder="Correo electrónico" />
          <InputField type="password" placeholder="Contraseña" />
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button label="Iniciar Sesión" primary />
          </div>
        </form>
        <Text>
          ¿No tienes una cuenta? 
          <br />
          <Link to="/registrarse" style={linkStyle}>Registrate</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
