import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import colors from '../assets/Colors'; // Importamos el archivo de colores
import axios from 'axios';
import Loader from '../components/common/Loader'; // Importa el componente Loader
import FeedbackModal from '../components/common/FeedbackModal'; // Importa el modal de feedback

// Importamos los íconos de FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CardContainer, Container, FormLogin, Input, InputContainer, LinkStyle, PasswordConatiner, Text, Title, TogglePasswordButton } from '../components/common/CommonStyles';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/pagina-principal');
    }
  }
  , []);

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



  const headingStyle = {
    textAlign: 'center',
    marginBottom: '80px',
    fontSize: '24px',
    color: colors.white, // Usamos la variable de color para el encabezado
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
        navigate('/home');
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
    <Container>
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
      <CardContainer>
        <Title>Inicia Sesión</Title>
        <FormLogin onSubmit={handleLogin}>
          <InputContainer>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errorEmail && <div style={{ color: 'red', fontSize: '12px', alignSelf: 'flex-start', marginTop: '5px' }}>{errorEmail}</div>}
          </InputContainer>
          <PasswordConatiner >
            <Input
              type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TogglePasswordButton
              onClick={() => setShowPassword(!showPassword)} // Alterna entre mostrar u ocultar la contraseña
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /> {/* Ícono de ojo */}
            </TogglePasswordButton>
          </PasswordConatiner>
          {errorPassword && <div style={{ color: 'red', fontSize: '12px', alignSelf: 'flex-start', marginTop: '5px' }}>{errorPassword}</div>}
          
          <div>
            <Button type="submit" label="Iniciar Sesión" primary disabled={!isFormValid} /> {/* Deshabilitar si el formulario no es válido */}
          </div>
        </FormLogin>
        <Text style={{ marginTop: '20px', color: colors.white }}>
          ¿No tienes una cuenta? 
          <br />
          <LinkStyle onClick={() => navigate('/registrarse')} >Regístrate</LinkStyle>
        </Text>
      </CardContainer>

      {/* Modal de feedback */}
      {showModal && (
        <FeedbackModal 
          type="error" 
          message={modalMessage} 
          details={modalDetails} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </Container>
  );
};

export default Login;