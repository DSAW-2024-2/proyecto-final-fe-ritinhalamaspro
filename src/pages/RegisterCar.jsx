import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Loader from '../components/Loader'; // Importa tu componente Loader
import colors from '../components/colors';
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
          'Content-Type': 'multipart/form-data',
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

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        {currentStep === 1 && (
          <>
            <Title>¡Registra <span style={{ color: colors.third }}><strong>tu carro</strong></span>!</Title>

            {/* Formulario para registrar los detalles del carro */}
            <form>
              <InputField 
                type="text" 
                placeholder="Placa" 
                value={plate} 
                onChange={(e) => setPlate(e.target.value)} 
              />
              <InputField 
                type="text" 
                placeholder="Capacidad Vehículo" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)} 
              />
              <InputField 
                type="text" 
                placeholder="Marca" 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)} 
              />
              <InputField 
                type="text" 
                placeholder="Modelo" 
                value={model} 
                onChange={(e) => setModel(e.target.value)} 
              />

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button onClick={handleNextStep} label="Siguiente" primary />
              </div>
            </form>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Title>¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu Carro</strong></span>!</Title>

            {/* Formulario para agregar la foto del carro */}
            <form>
              <AddPhoto label="Agregar foto del carro" onPhotoChange={setCarPhoto} />
              
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button onClick={handleNextStep} label="Siguiente" primary />
              </div>
            </form>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Title>¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu SOAT vigente</strong></span>!</Title>

            {/* Formulario para agregar la foto del SOAT */}
            <form onSubmit={handleSubmit}>
              <AddPhoto label="Agregar foto del SOAT" onPhotoChange={setSoatPhoto} />

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button type="submit" label="¡Listo!" primary />
              </div>
            </form>
          </>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Loader /> {/* Reemplaza el texto "Cargando..." con el componente Loader */}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RegisterCar;