import React, { useState } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import { Link, useNavigate } from 'react-router-dom';
import colors from '../components/colors'; // Importamos el archivo de colores
import axios from 'axios';
import Loader from '../components/Loader'; // Importa el componente Loader

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState(''); // Error de email
  const [errorPassword, setErrorPassword] = useState(''); // Error de contraseña
  const [error, setError] = useState(null); // Error global para otros errores
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Validación de los campos
    if (!email) {
      setErrorEmail('Por favor ingrese un correo electrónico');
      return;
    }
    if (!password) {
      setErrorPassword('Por favor ingrese una contraseña');
      return;
    }
  
    setLoading(true); // Activar el loader cuando se envía el formulario
  
    // Imprimir el JSON que se enviará al servidor
    const loginData = {
      email,
      password,
    };
    console.log('Datos enviados al servidor:', JSON.stringify(loginData, null, 2));
  
    try {
      // Hacemos la solicitud POST al endpoint de login
      const response = await axios.post('https://proyecto-final-be-ritinhalamaspro.vercel.app/login', loginData);
  
      // Imprimir la respuesta JSON en consola
      console.log('Respuesta del servidor:', response.data);
  
      // Si la respuesta es exitosa (por ejemplo, si se devuelve un token o una confirmación)
      if (response.status === 200) {
        console.log('Usuario autenticado correctamente');
        // Redirigir al usuario a la página principal
        navigate('/pagina-principal');
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      setError('Hubo un error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false); // Desactivar el loader después de la respuesta
    }
  };
  

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo negro semi-transparente
          zIndex: 999, // Asegura que el loader esté por encima de todo
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Loader />
        </div>
      )}
      <Card>
        <Title style={headingStyle}>Inicia Sesión</Title>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form style={formStyle} onSubmit={handleLogin}>
          <InputField
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errorEmail && <div style={{ color: 'red', fontSize: '12px', alignSelf: 'flex-start', marginTop: '5px' }}>{errorEmail}</div>}
          
          <InputField
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorPassword && <div style={{ color: 'red', fontSize: '12px', alignSelf: 'flex-start', marginTop: '5px' }}>{errorPassword}</div>}
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button type="submit" label="Iniciar Sesión" primary />
          </div>
        </form>
        <Text style={{ marginTop: '20px', color: colors.white }}>
          ¿No tienes una cuenta? 
          <br />
          <Link to="/registrarse" style={linkStyle}>Regístrate</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
