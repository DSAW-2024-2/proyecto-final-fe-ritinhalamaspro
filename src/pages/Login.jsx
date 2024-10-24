import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import { Link, useNavigate } from 'react-router-dom';
import colors from '../components/colors'; // Importamos el archivo de colores
import axios from 'axios';
import Loader from '../components/Loader'; // Importa el componente Loader
import FeedbackModal from '../components/FeedbackModal'; // Importa el modal de feedback

// Importamos los íconos de FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña
  const [errorEmail, setErrorEmail] = useState(''); // Error de email
  const [errorPassword, setErrorPassword] = useState(''); // Error de contraseña
  const [error, setError] = useState(null); // Error global para otros errores
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje que se mostrará en el modal
  const [modalDetails, setModalDetails] = useState(''); // Detalles del mensaje en el modal

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

    const loginData = {
      email,
      password,
    };
    console.log('Datos enviados al servidor:', JSON.stringify(loginData, null, 2));

    try {
      const response = await axios.post('https://proyecto-final-be-ritinhalamaspro.vercel.app/login', loginData);

      console.log('Respuesta del servidor:', response.data);

      if (response.status === 200) {
        console.log('Usuario autenticado correctamente');
        // Guardar el token en el localStorage
        localStorage.setItem('token', response.data.token);
        navigate('/pagina-principal');
      } else {
        // Si las credenciales son incorrectas, mostramos el modal
        setModalMessage('Credenciales incorrectas');
        setModalDetails('El correo electrónico o la contraseña no coinciden. Intenta nuevamente.');
        setShowModal(true); // Muestra el modal de error
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      setModalMessage('Error');
      setModalDetails('Hubo un error al intentar iniciar sesión. Intenta nuevamente.');
      setShowModal(true); // Muestra el modal de error
    } finally {
      setLoading(false); // Desactivar el loader después de la respuesta
    }
  };

  const isFormValid = email && password;

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
        <form style={formStyle} onSubmit={handleLogin}>
          <InputField
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errorEmail && <div style={{ color: 'red', fontSize: '12px', alignSelf: 'flex-start', marginTop: '5px' }}>{errorEmail}</div>}
          
          <div style={{ position: 'relative', width: '100%' }}>
            <InputField
              type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Alterna entre mostrar u ocultar la contraseña
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /> {/* Ícono de ojo */}
            </button>
          </div>
          {errorPassword && <div style={{ color: 'red', fontSize: '12px', alignSelf: 'flex-start', marginTop: '5px' }}>{errorPassword}</div>}
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button type="submit" label="Iniciar Sesión" primary disabled={!isFormValid} /> {/* Deshabilitar si el formulario no es válido */}
          </div>
        </form>
        <Text style={{ marginTop: '20px', color: colors.white }}>
          ¿No tienes una cuenta? 
          <br />
          <Link to="/registrarse" style={linkStyle}>Regístrate</Link>
        </Text>
      </Card>

      {/* Modal de feedback */}
      {showModal && (
        <FeedbackModal 
          type="error" 
          message={modalMessage} 
          details={modalDetails} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default Login;