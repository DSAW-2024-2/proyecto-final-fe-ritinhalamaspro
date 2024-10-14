import React from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import Title from '../components/Title'; // Importamos el componente Title
import Text from '../components/Text'; // Importamos el componente Text

const Register = () => {
  const linkStyle = {
    color: '#D130FE',
    textDecoration: 'underline', // Subrayado por defecto
    cursor: 'pointer',           // Cambiar el cursor cuando esté encima del link
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)' 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>Regístrate</Title>
        <form>
          <InputField type="text" placeholder="Nombre Completo" />
          <InputField type="text" placeholder="ID de la Universidad" />
          <InputField type="email" placeholder="Correo Electrónico" />
          <InputField type="tel" placeholder="Teléfono" />
          <InputField type="password" placeholder="Contraseña" />
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button to="/agrega-tu-foto" label="Registrarse" primary />
          {/* /**A Donde???? */ }
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
