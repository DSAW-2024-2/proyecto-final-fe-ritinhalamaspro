import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Button from '../components/common/Button';
import Loader from '../components/common/Loader'; // Importa tu componente Loader
import colors from '../assets/Colors';
import AddPhoto from '../components/common/AddPhoto'; // Importa el componente AddPhoto
import axios from 'axios';
import { CardContainer, Container, FormLogin, Input, InputContainer, Title } from '../components/common/CommonStyles';

const RegisterCarNoHeader = () => {
  const [currentStep, setCurrentStep] = useState(1); // Controla los pasos del formulario
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [carPhoto, setCarPhoto] = useState(null);
  const [soatPhoto, setSoatPhoto] = useState(null);
  const [loading, setLoading] = useState(false); // Control de carga
  const navigate = useNavigate(); // Hook para navegar entre rutas

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }
  , []);
  // Estados para errores de validación
  const [plateError, setPlateError] = useState('');
  const [capacityError, setCapacityError] = useState('');

  // Calcula si todos los campos están llenos
  const isStep1Filled = plate && capacity && brand && model;

  // Función de validación
  const validateFields = () => {
    let isValid = true;

    // Validar placa
    const platePattern = /^[A-Za-z]{3}\d{3}$/;
    if (!platePattern.test(plate)) {
      setPlateError('La placa debe tener 3 letras y 3 números');
      isValid = false;
    } else {
      setPlateError('');
    }

    // Validar capacidad
    const capacityPattern = /^\d+$/;
    if (!capacityPattern.test(capacity)) {
      setCapacityError('La capacidad debe ser un número');
      isValid = false;
    } else {
      setCapacityError('');
    }

    // Puedes agregar validaciones para 'brand' y 'model' si es necesario

    return isValid;
  };

  // Maneja el envío del formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mostrar estado de carga

    const formData = new FormData();
    formData.append('plate', plate);
    formData.append('capacity', capacity);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('carPhoto', carPhoto);
    formData.append('soatPhoto', soatPhoto);

    try {
      // Recuperar el token desde el localStorage
      const token = localStorage.getItem('token'); 

      // Hacer la solicitud POST al servidor con el token en los headers
      const url = `${import.meta.env.VITE_API_URL}/register_car`;

      const response = await axios.post(url, formData, {
        headers: {
          // No establecer 'Content-Type' manualmente
          'Authorization': `Bearer ${token}`, // Incluir el token en los headers
        },
      });

      console.log('Carro registrado:', response.data);

      // Redirigir a la página principal si el registro fue exitoso
      navigate('/pagina-principal');
    } catch (error) {
      console.error('Error registrando el carro:', error);
    } finally {
      setLoading(false); // Ocultar estado de carga
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const isValid = validateFields();
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
<Container>  
     <CardContainer>
        {currentStep === 1 && (
          <>
            <Title>¡Registra <span style={{ color: colors.third }}><strong>tu carro</strong></span>!</Title>

            {/* Formulario para registrar los detalles del carro */}
            <FormLogin onSubmit={handleNextStep}>
              <InputContainer>
                <Input
                  type="text" 
                  placeholder="Placa" 
                  value={plate} 
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setPlate(value);
                  }} 
                  error={plateError}
                />
                {plateError && <small style={{ color: colors.third }}>{plateError}</small>}
              </InputContainer>

              <InputContainer>
                <Input 
                  type="text" 
                  placeholder="Capacidad Vehículo" 
                  value={capacity} 
                  onChange={(e) => {
                    setCapacity(e.target.value);
                  }} 
                  error={capacityError}
                />
                {capacityError && <small style={{ color: colors.third }}>{capacityError}</small>}
              </InputContainer>

              <InputContainer>
                <Input 
                  type="text" 
                  placeholder="Marca" 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)} 
                />
              </InputContainer>

              <InputContainer>
                <Input 
                  type="text" 
                  placeholder="Modelo" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)} 
                />
              </InputContainer>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom:'20px' }}>
                <Button type="submit" label="Siguiente" primary disabled={!isStep1Filled} />
              </div>
            </FormLogin>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Title>¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu Carro</strong></span>!</Title>

            {/* Formulario para agregar la foto del carro */}
            <FormLogin>
              <AddPhoto
                label="Agregar foto del carro"
                onPhotoChange={setCarPhoto}
                photo={carPhoto} // Pasamos la foto seleccionada
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom:'20px'}}>
                <Button onClick={handlePreviousStep} label="Anterior" />
                <Button onClick={handleNextStep} label="Siguiente" primary disabled={!carPhoto} />
              </div>
            </FormLogin>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Title>¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu SOAT vigente</strong></span>!</Title>

            {/* Formulario para agregar la foto del SOAT */}
            <FormLogin onSubmit={handleSubmit}>
              <AddPhoto
                label="Agregar foto del SOAT"
                onPhotoChange={setSoatPhoto}
                photo={soatPhoto} // Pasamos la foto seleccionada
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%',marginBottom:'20px' }}>
                <Button onClick={handlePreviousStep} label="Anterior" />
                <Button type="submit" label="¡Listo!" primary disabled={!soatPhoto} />
              </div>
            </FormLogin>
          </>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Loader />
          </div>
        )}
      </CardContainer>
      </Container>   );
};

export default RegisterCarNoHeader;
