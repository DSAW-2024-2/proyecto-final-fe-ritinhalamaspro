// Register.jsx
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import colors from '../assets/Colors';
import axios from 'axios';
import Loader from '../components/common/Loader';
import ProfilePhoto from '../components/common/ProfilePhoto';
import FeedbackModal from '../components/common/FeedbackModal';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CardContainer, Container, FormLogin, Input, InputContainer, LinkStyle, PasswordConatiner, StyledAddButton, StyledAddButton1, Text, Title } from '../components/common/CommonStyles';
import emailjs from '@emailjs/browser';

const Register = () => {
  const [steps, setSteps] = useState(1); // Variable para controlar los pasos
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
  const [selectedImage, setSelectedImage] = useState(null); // Para la foto de perfil
  const [imagePreviewUrl, setImagePreviewUrl] = useState("src/assets/PofilePhoto.png"); // Para la vista previa de la foto
  const [selectedRole, setSelectedRole] = useState("Conductor"); // Estado para manejar la selección del rol
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Referencia al input de tipo file

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalDetails, setModalDetails] = useState('');

  // Función para mostrar el modal de error
  const handleModalError = (message, details) => {
    setModalMessage(message);
    setModalDetails(details);
    setShowModal(true);
  };

  // Función para cerrar el modal y redirigir
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/iniciar-sesion');
  };

  const sendWelcomeEmail = (email, name) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      console.error('La dirección de correo electrónico es inválida o está vacía.');
      return;
    }
  
    const templateParams = {
      to_name: name,
      to_email: email,
      from_name: 'MoveU',
    };
  
    emailjs
      .send(
        import.meta.env.VITE_API_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_API_KEY_EMAILJS
      )
      .then(
        (response) => {
          console.log('Correo enviado exitosamente:', response.status, response.text);
        },
        (error) => {
          console.error('Error al enviar el correo:', error);
        }
      );
  };

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
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      setPhoneNumberError('El número de teléfono debe tener exactamente 10 números.');
      isValid = false;
    } else {
      setPhoneNumberError(''); // Si está vacío o correcto, no hay error
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
      setIsButtonDisabled(false); // Habilitar el botón si todos los campos están completos
    } else {
      setIsButtonDisabled(true); // Deshabilitar el botón si falta algún campo
    }
  }, [name, surName, universityId, email, phoneNumber, password]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    setSteps(2); // Cambia al paso 2
  };

  // Hace la solicitud de registro en el step 2 y avanza al step 3
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surName', surName);
      formData.append('universityID', universityId);
      formData.append('email', email);
      formData.append('phoneNumber', phoneNumber);
      formData.append('password', password);
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }

      const response = await axios.post('https://proyecto-final-be-ritinhalamaspro.vercel.app/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Usuario registrado correctamente');
        
        // Guardar el token en localStorage
        const token = response.data.token;
        localStorage.setItem('token', token); // Guardar token
        sendWelcomeEmail(email, name); // Enviar correo de bienvenida
        setSteps(3); // Cambiar al paso 3 después del registro exitoso
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Hubo un error al registrar el usuario. Intenta nuevamente.';
      
      // Si el error es que el ID de la universidad ya existe, mostramos el modal
      if (error.response?.data?.message === 'El ID ya existe') {
        handleModalError('Error al registrar', 'El ID de la universidad ya existe. Intenta con otro o inicia sesión.');
      } else {
        alert(errorMessage); // Otro tipo de error
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
      setSelectedImage(file);
    }
  };

  // Asegúrate de liberar la URL creada cuando se cambie la imagen o el componente se desmonte
  useEffect(() => {
    return () => {
      if (imagePreviewUrl !== "src/assets/ProfilePhoto.png") {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleRoleSelection = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === "Conductor") {
      navigate("/register-car");
    } else {
      navigate("/pagina-principal");
    }
  };

  // Función para retroceder de paso
  const handlePreviousStep = () => {
    if (steps > 1) {
      setSteps(steps - 1);
    }
  };

  const profileContainerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',    
    width: '100%',
    marginBottom: '20px',
  };

  const addButtonContainerStyle = {
    position: 'absolute',  
    top: '210px',          
    left: '60%',           
    transform: 'translateX(-50%)',
  };

  return (

<Container>

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

      {showModal && (
        <FeedbackModal
          type="error"
          message={modalMessage}
          details={modalDetails}
          onClose={handleCloseModal}
        />
      )}

      <CardContainer>
        {steps === 1 && (
        <>
        <Title>Regístrate</Title>
        <FormLogin onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
              <Input 
                type="text" 
                placeholder="Nombre" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              {nameError && <small style={{ color: colors.third }}>{nameError}</small>}
            </div >
            <div style={{ display: 'flex'}}>
              <Input 
                type="text" 
                placeholder="Apellidos" 
                value={surName} 
                onChange={(e) => setSurName(e.target.value)} 
              />
              {surNameError && <small style={{ color: colors.third}}>{surNameError}</small>}
            </div>
          </div>

          <InputContainer>
            <Input 
              type="text" 
              placeholder="ID de la Universidad" 
              value={universityId} 
              onChange={(e) => setUniversityId(e.target.value)} 
            />
            {universityIdError && <small style={{ color: colors.third }}>{universityIdError}</small>}
          </InputContainer>

          <InputContainer>
            <Input 
              type="email" 
              placeholder="Correo Electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {emailError && <small style={{ color: colors.third }}>{emailError}</small>}
          </InputContainer>

          <InputContainer>
            <Input 
              type="tel" 
              placeholder="Teléfono" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
            />
            {phoneNumberError && <small style={{ color: colors.third }}>{phoneNumberError}</small>}
          </InputContainer>

          <PasswordConatiner>
            <Input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
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
                color: 'white'
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}  />
            </button>
          </PasswordConatiner>
          {passwordError && <small style={{ color: colors.third }}>{passwordError}</small>}

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
           <Button type="submit" label="Registrarse" primary disabled={isButtonDisabled} onClick={handleNextStep} />
         </div>

        </FormLogin>

        <Text>
          ¿Ya tienes una cuenta?  
          <LinkStyle onClick={() => navigate('/iniciar-sesion')}> Inicia sesión</LinkStyle>
        </Text>
      </>
        )}

        {steps === 2 && ( // Paso 2: Agregar foto de perfil y registrar
          <>
            <Title>Agrega tu foto</Title>
            <FormLogin onSubmit={handleSubmit}>
              <div style={profileContainerStyle}>
                <ProfilePhoto
                  imageUrl={imagePreviewUrl}
                  size="170px"
                />

                <div style={addButtonContainerStyle}>
                  <input
                    type="file"
                    id="imageUpload"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                    accept="image/*"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <StyledAddButton1>+</StyledAddButton1>
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%',marginBottom:'20px' }}>
                <Button onClick={handlePreviousStep} label="Anterior" />
                <Button type="submit" label="¡Listo!" primary />
              </div>
            </FormLogin>
          </>
        )}

        {steps === 3 && ( // Paso 3: Selección de rol
          <>
            <Title>Selecciona tu rol</Title>
            <StyledWrapper>
              <div className="radio-buttons-container">
                <div className="radio-button">
                  <input
                    name="radio-group"
                    id="radio2"
                    className="radio-button__input"
                    type="radio"
                    value="Usuario"
                    onChange={handleRoleSelection}
                  />
                  <label htmlFor="radio2" className="radio-button__label">
                    <span className="radio-button__custom" />
                    Usuario
                  </label>
                </div>

                <div className="radio-button">
                  <input
                    name="radio-group"
                    id="radio1"
                    className="radio-button__input"
                    type="radio"
                    value="Conductor"
                    onChange={handleRoleSelection}
                    defaultChecked
                  />
                  <label htmlFor="radio1" className="radio-button__label">
                    <span className="radio-button__custom" />
                    Conductor
                  </label>
                </div>
              </div>
            </StyledWrapper>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button type="submit" label="Siguiente" primary onClick={handleRoleSubmit} />
            </div>
          </>
        )}
      </CardContainer>
      </Container> 
  );
};

// Estilos para los radio buttons
const StyledWrapper = styled.div`
  .radio-buttons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }

  .radio-button {
    display: inline-block;
    position: relative;
    cursor: pointer;
  }

  .radio-button__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .radio-button__label {
    display: inline-block;
    padding-left: 30px;
    margin-bottom: 10px;
    position: relative;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .radio-button__custom {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${colors.details};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .radio-button__input:checked + .radio-button__label .radio-button__custom {
    transform: translateY(-50%) scale(0.9);
    border: 5px solid ${colors.third};
    color: ${colors.details};
  }

  .radio-button__input:checked + .radio-button__label {
    color: ${colors.third};
    font-size: 25px;
  }

  .radio-button__label:hover .radio-button__custom {
    transform: translateY(-50%) scale(1.2);
    border-color: ${colors.primary};
    box-shadow: 0 0 10px #D130FE80;
  }
`;

export default Register;
