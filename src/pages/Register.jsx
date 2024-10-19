import React from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Title from '../components/Title';
import Text from '../components/Text';
import colors from '../components/colors'; // Importamos el archivo de colores

const Register = () => {
  const linkStyle = {
    color: colors.third, // Usamos la variable de color para el enlace
    textDecoration: 'underline',
    cursor: 'pointer',
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>Regístrate</Title>
        <form>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '7px' }}>
            <InputField type="text" placeholder="Nombre" />
            <InputField type="text" placeholder="Apellidos" />
          </div>

          <InputField type="text" placeholder="ID de la Universidad" />
          <InputField type="email" placeholder="Correo Electrónico" />
          <InputField type="tel" placeholder="Teléfono" />
          <InputField type="password" placeholder="Contraseña" />
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button to="/agrega-tu-foto" label="Registrarse" primary />
          </div>
        </form>
        <Text>
          ¿Ya tienes una cuenta?  
          <Link to="/iniciar-sesion" style={linkStyle}> Iniciar Sesión</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Register;
