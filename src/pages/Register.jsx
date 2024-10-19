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

const Register = () => {
  const [name, setName] = useState('');
  const [surName, setSurName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga

  const navigate = useNavigate(); // Usa useNavigate para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el loader cuando el formulario se envía

    // Validación de los campos
    if (!name || !surName || !universityId || !email || !phoneNumber || !password) {
      setError('Por favor, completa todos los campos.');
      setLoading(false); // Desactivar el loader
      return;
    }

    // Validación de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      setLoading(false);
      return;
    }

    // Validación de contraseña (mínimo 8 caracteres)
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      setLoading(false);
      return;
    }

    // Validación de teléfono (solo números)
    const phoneRegex = /^[0-9]{10}$/; // Ajusta según el formato del teléfono que esperas
    if (!phoneRegex.test(phoneNumber)) {
      setError('El número de teléfono no es válido.');
      setLoading(false);
      return;
    }

    // Imprimir los datos que se van a enviar en la solicitud
    console.log('Datos enviados:', {
      name,
      surName,
      universityId,
      email,
      phoneNumber,
      password
    });

    try {
      // Realizar la solicitud POST a la API
      const response = await axios.post('https://proyecto-final-be-ritinhalamaspro.vercel.app/register', {
        name,
        surName,
        universityId,
        email,
        phoneNumber,
        password,
      });

      // Si el registro fue exitoso, redirigir al usuario
      if (response.status === 201) {
        console.log('Usuario registrado correctamente');
        navigate('/agrega-tu-foto'); // Redirige al usuario usando navigate
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Hubo un error al registrar el usuario. Intenta nuevamente.';
      setError(errorMessage);
    } finally {
      setLoading(false); // Desactivar el loader después de la solicitud
    }
  };

  const linkStyle = {
    color: colors.third, // Usamos la variable de color para el enlace
    textDecoration: 'underline',
    cursor: 'pointer',
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)',
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
        <Title>Regístrate</Title>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '7px' }}>
            <InputField 
              type="text" 
              placeholder="Nombre" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <InputField 
              type="text" 
              placeholder="Apellidos" 
              value={surName} 
              onChange={(e) => setSurName(e.target.value)} 
            />
          </div>

          <InputField 
            type="text" 
            placeholder="ID de la Universidad" 
            value={universityId} 
            onChange={(e) => setUniversityId(e.target.value)} 
          />
          <InputField 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <InputField 
            type="tel" 
            placeholder="Teléfono" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />
          <InputField 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button type="submit" label="Registrarse" primary />
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
