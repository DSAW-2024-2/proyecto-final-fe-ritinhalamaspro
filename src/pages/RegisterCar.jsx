import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Loader from '../components/Loader'; // Importa tu componente Loader
import colors from '../components/Colors';
import AddPhoto from '../components/AddPhoto'; // Importa el componente AddPhoto
import axios from 'axios';

const RegisterCar = () => {
  const [currentStep, setCurrentStep] = useState(1); // Controla los pasos del formulario
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [carPhoto, setCarPhoto] = useState(null);
  const [soatPhoto, setSoatPhoto] = useState(null);
  const [loading, setLoading] = useState(false); // Control de carga
  const navigate = useNavigate(); // Hook para navegar entre rutas

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
      const response = await axios.post('https://proyecto-final-be-ritinhalamaspro.vercel.app/register_car', formData, {
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        {currentStep === 1 && (
          <>
            <Title>¡Registra <span style={{ color: colors.third }}><strong>tu carro</strong></span>!</Title>

            {/* Formulario para registrar los detalles del carro */}
            <form onSubmit={handleNextStep}>
              <div>
                <InputField 
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
              </div>

              <div>
                <InputField 
                  type="text" 
                  placeholder="Capacidad Vehículo" 
                  value={capacity} 
                  onChange={(e) => {
                    setCapacity(e.target.value);
                  }} 
                  error={capacityError}
                />
                {capacityError && <small style={{ color: colors.third }}>{capacityError}</small>}
              </div>

              <div>
                <InputField 
                  type="text" 
                  placeholder="Marca" 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)} 
                />
              </div>

              <div>
                <InputField 
                  type="text" 
                  placeholder="Modelo" 
                  value={model} 
                  onChange={(e) => setModel(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button type="submit" label="Siguiente" primary disabled={!isStep1Filled} />
              </div>
            </form>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Title>¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu Carro</strong></span>!</Title>

            {/* Formulario para agregar la foto del carro */}
            <form>
              <AddPhoto
                label="Agregar foto del carro"
                onPhotoChange={setCarPhoto}
                photo={carPhoto} // Pasamos la foto seleccionada
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Button onClick={handlePreviousStep} label="Anterior" />
                <Button onClick={handleNextStep} label="Siguiente" primary disabled={!carPhoto} />
              </div>
            </form>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Title>¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu SOAT vigente</strong></span>!</Title>

            {/* Formulario para agregar la foto del SOAT */}
            <form onSubmit={handleSubmit}>
              <AddPhoto
                label="Agregar foto del SOAT"
                onPhotoChange={setSoatPhoto}
                photo={soatPhoto} // Pasamos la foto seleccionada
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Button onClick={handlePreviousStep} label="Anterior" />
                <Button type="submit" label="¡Listo!" primary disabled={!soatPhoto} />
              </div>
            </form>
          </>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Loader />
          </div>
        )}
      </Card>
    </div>
  );
};

export default RegisterCar;
