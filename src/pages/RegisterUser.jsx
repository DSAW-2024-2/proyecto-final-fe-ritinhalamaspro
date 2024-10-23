import React, { useState } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import AddPhoto from '../components/AddPhoto';
import RegisterCar from './RegisterCar';
import AddCarPhoto from './AddCarPhoto';
import AddSoatPhoto from './AddSoatPhoto';
import colors from '../components/colors';

const RegisterUser = () => {
  const [step, setStep] = useState(0);
  const [isDriver, setIsDriver] = useState(false); // para saber si el usuario elige ser conductor

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const previousStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        {/* Step 1: Register User */}
        {step === 0 && (
          <>
            <Title>Regístrate</Title>
            <form>
              <InputField type="text" placeholder="Nombre completo" />
              <InputField type="email" placeholder="Correo electrónico" />
              <InputField type="password" placeholder="Contraseña" />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={nextStep} label="Siguiente" primary />
              </div>
            </form>
          </>
        )}

        {/* Step 2: Add Profile Photo */}
        {step === 1 && (
          <>
            <Title>Agrega tu foto de perfil</Title>
            <form>
              <AddPhoto />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={nextStep} label="Siguiente" primary />
              </div>
            </form>
          </>
        )}

        {/* Step 3: Choose Role */}
        {step === 2 && (
          <>
            <Title>Elige tu rol</Title>
            <Text>¿Te gustaría registrarte como conductor?</Text>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => {
                  setIsDriver(true); // elige ser conductor
                  nextStep();
                }}
                label="Sí"
                primary
              />
              <Button
                onClick={() => {
                  setIsDriver(false); // no elige ser conductor
                  alert('¡Gracias por registrarte!');
                }}
                label="No"
              />
            </div>
          </>
        )}

        {/* Step 4: Register Car (if user chooses to be a driver) */}
        {step === 3 && isDriver && (
          <>
            <RegisterCar />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={nextStep} label="Siguiente" primary />
            </div>
          </>
        )}

        {/* Step 5: Add Car Photo */}
        {step === 4 && isDriver && (
          <>
            <AddCarPhoto />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={nextStep} label="Siguiente" primary />
            </div>
          </>
        )}

        {/* Step 6: Add SOAT Photo */}
        {step === 5 && isDriver && (
          <>
            <AddSoatPhoto />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={() => alert('¡Registro completo!')} label="¡Listo!" primary />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default RegisterUser;
