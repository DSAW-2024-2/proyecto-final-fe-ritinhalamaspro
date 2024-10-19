import React from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import { Link } from 'react-router-dom';
import colors from '../components/colors'; // Importamos el archivo de colores

const Login = () => {
  const headingStyle = {
    textAlign: 'center',
    marginBottom: '80px',
    fontSize: '24px',
    color: colors.white, // Usamos la variable de color para el encabezado
  };

  const linkStyle = {
    color: colors.third, // Usamos la variable de color para el enlace
    textDecoration: 'underline',
    cursor: 'pointer',
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
        <form style={formStyle}>
          <InputField
            type="email"
            placeholder="Correo electrónico"
            required
          />
          <InputField
            type="password"
            placeholder="Contraseña"
            required
          />
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button to="/pagina-principal" label="Iniciar Sesión" primary />
          </div>
        </form>
        <Text style={{ marginTop: '20px', color: colors.white }}> {/* Usamos la variable de color para el texto */}
          ¿No tienes una cuenta? 
          <br />
          <Link to="/registrarse" style={linkStyle}>Regístrate</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
