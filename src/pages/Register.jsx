import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import { Link, useNavigate } from 'react-router-dom';
import colors from '../components/colors';
import axios from 'axios';
import Loader from '../components/Loader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [name, setName] = useState('');
  const [surName, setSurName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [surNameError, setSurNameError] = useState('');
  const [universityIdError, setUniversityIdError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Estado para habilitar/deshabilitar el botón
  const navigate = useNavigate();

  // Función para validar los campos
  const validateFields = () => {
    let isValid = true;

    // Validar nombre (solo letras)
    const nameRegex = /^[a-zA-Z]+$/;
    if (!name) {
      setNameError('El nombre es requerido.');
      isValid = false;
    } else if (!nameRegex.test(name)) {
      setNameError('El nombre debe contener solo letras.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validar apellidos (solo letras)
    if (!surName) {
      setSurNameError('Los apellidos son requeridos.');
      isValid = false;
    } else if (!nameRegex.test(surName)) {
      setSurNameError('Los apellidos deben contener solo letras.');
      isValid = false;
    } else {
      setSurNameError('');
    }

    // Validar ID de la Universidad (exactamente 10 números)
    const universityIdRegex = /^[0-9]{10}$/;
    if (!universityId) {
      setUniversityIdError('El ID de la Universidad es requerido.');
      isValid = false;
    } else if (!universityIdRegex.test(universityId)) {
      setUniversityIdError('El ID de la Universidad debe contener exactamente 10 números.');
      isValid = false;
    } else {
      setUniversityIdError('');
    }

    // Validar email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError('El correo electrónico es requerido.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validar teléfono
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError('El número de teléfono no es válido.');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

    // Validar contraseña
    if (!password) {
      setPasswordError('La contraseña es requerida.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // Validar si todos los campos están llenos para habilitar el botón
  useEffect(() => {
    if (
      name &&
      surName &&
      universityId &&
      email &&
      password
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true); 
    }
  }, [name, surName, universityId, email, phoneNumber, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://proyecto-final-be-ritinhalamaspro.vercel.app/register', {
        name,
        surName,
        universityID: universityId,
        email,
        phoneNumber,
        password,
      });

      if (response.status === 201) {
        console.log('Usuario registrado correctamente');
        navigate('/agrega-tu-foto');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Hubo un error al registrar el usuario. Intenta nuevamente.';
      alert(errorMessage);
    } finally {
      setLoading(false);
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
          backgroundColor: 'rgba(0, 0, 0, 0.633)', 
          zIndex: 999, 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Loader />
        </div>
      )}
      <Card>
        <Title>Regístrate</Title>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '7px' }}>
            <div>
              <InputField 
                type="text" 
                placeholder="Nombre" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              {nameError && <small style={{ color: colors.third }}>{nameError}</small>}
            </div>
            <div>
              <InputField 
                type="text" 
                placeholder="Apellidos" 
                value={surName} 
                onChange={(e) => setSurName(e.target.value)} 
              />
              {surNameError && <small style={{ color: colors.third}}>{surNameError}</small>}
            </div>
          </div>

          <div>
            <InputField 
              type="text" 
              placeholder="ID de la Universidad" 
              value={universityId} 
              onChange={(e) => setUniversityId(e.target.value)} 
            />
            {universityIdError && <small style={{ color: colors.third }}>{universityIdError}</small>}
          </div>

          <div>
            <InputField 
              type="email" 
              placeholder="Correo Electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {emailError && <small style={{ color: colors.third }}>{emailError}</small>}
          </div>

          <div>
            <InputField 
              type="tel" 
              placeholder="Teléfono" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
            />
            {phoneNumberError && <small style={{ color: colors.third}}>{phoneNumberError}</small>}
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <InputField 
          type={showPassword ? 'text' : 'password'} 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ flex: 1 }} 
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1, 
          }}
        >
          <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size="lg" />
        </button>
      </div>
      {passwordError && <small style={{ color: colors.third }}>{passwordError}</small>}
    </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button type="submit" label="Registrarse" primary disabled={isButtonDisabled} />
          </div>
        </form>

        <Text>
          ¿Ya tienes una cuenta?  
          <Link to="/iniciar-sesion" style={{ color: colors.third, textDecoration: 'none' }}>Inicia sesión</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Register;
