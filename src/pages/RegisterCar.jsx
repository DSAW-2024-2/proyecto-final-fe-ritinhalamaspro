import React, { useState } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import AddPhoto from '../components/AddPhoto';
import Title from '../components/Title';
import colors from '../components/colors';
import axios from 'axios';

const RegisterCar = () => {
  const [currentStep, setCurrentStep] = useState(1); // Variable para controlar qué "página" mostrar
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [carPhoto, setCarPhoto] = useState(null);
  const [soatPhoto, setSoatPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('plate', plate);
    formData.append('capacity', capacity);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('carPhoto', carPhoto);
    formData.append('soatPhoto', soatPhoto);

    try {
      const response = await axios.post('https://proyecto-final-be-ritinhalamaspro.vercel.app/register_car', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Carro registrado:', response.data);
    } catch (error) {
      console.error('Error registrando el carro:', error);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleCarPhotoChange = (e) => {
    setCarPhoto(e.target.files[0]);
  };

  const handleSoatPhotoChange = (e) => {
    setSoatPhoto(e.target.files[0]);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        {currentStep === 1 && (
          <>
            <Title>¡Registra <span style={{ color: colors.third }}><strong>tu carro</strong></span>!</Title>

            {/* Formulario para registrar carro */}
            <form>
              <InputField type="text" placeholder="Placa" value={plate} onChange={(e) => setPlate(e.target.value)} />
              <InputField type="text" placeholder="Capacidad Vehículo" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <InputField type="text" placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
              <InputField type="text" placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
              
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
              <input type="file" accept="image/*" onChange={handleCarPhotoChange} />
              
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
              <input type="file" accept="image/*" onChange={handleSoatPhotoChange} />

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button type="submit" label="¡Listo!" primary />
              </div>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

export default RegisterCar;
