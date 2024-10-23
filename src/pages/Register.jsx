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
import ProfilePhoto from '../components/ProfilePhoto';
import AddButton from '../components/AddButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterAndUploadPhoto = () => {
  const [step, setStep] = useState(1); // Estado para manejar los pasos
  const [name, setName] = useState('');
  const [surName, setSurName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState("src/assets/PofilePhoto.png");

  const [nameError, setNameError] = useState('');
  const [surNameError, setSurNameError] = useState('');
  const [universityIdError, setUniversityIdError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const navigate = useNavigate();

  // Función para validar los campos
  const validateFields = () => {
    let isValid = true;

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

    if (!surName) {
      setSurNameError('Los apellidos son requeridos.');
      isValid = false;
    } else if (!nameRegex.test(surName)) {
      setSurNameError('Los apellidos deben contener solo letras.');
      isValid = false;
    } else {
      setSurNameError('');
    }

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

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError('El número de teléfono no es válido.');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

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
    if (step === 1 && name && surName && universityId && email && password) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [step, name, surName, universityId, email, phoneNumber, password]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);  
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
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
          setStep(2); // Cambiar a la siguiente página
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || 'Hubo un error al registrar el usuario. Intenta nuevamente.';
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      navigate('/rol'); // Navegar al rol o siguiente paso
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
        {step === 1 && (
          <>
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
                  {surNameError && <small style={{ color: colors.third }}>{surNameError}</small>}
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
                {phoneNumberError && <small style={{ color: colors.third }}>{phoneNumberError}</small>}
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
                      transform: 'translateY(-50%)'
                    }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
                {passwordError && <small style={{ color: colors.third }}>{passwordError}</small>}
              </div>

              <Button type="submit" disabled={isButtonDisabled}>Continuar</Button>
            </form>

            <Text>
              ¿Ya tienes una cuenta? 
              <Link to="/login" style={{ textDecoration: 'underline', color: colors.primary }}> Inicia sesión</Link>
            </Text>
          </>
        )}

        {step === 2 && (
          <>
            <Title>Sube tu foto de perfil</Title>
            <ProfilePhoto image={selectedImage} />
            <AddButton onChange={handleImageUpload} />
            <Button onClick={handleSubmit}>Siguiente</Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default RegisterAndUploadPhoto;
