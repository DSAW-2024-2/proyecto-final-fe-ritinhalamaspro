import React from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import Title from '../components/Title'; // Importamos el componente Title
import Text from '../components/Text'; // Importamos el componente Text
import colors from '../components/colors'; // Importamos el archivo de colores

const RegisterCar = () => {
  const linkStyle = {
    color: colors.third, // Usamos la variable de color para el enlace
    textDecoration: 'underline', // Subrayado por defecto
    cursor: 'pointer',           // Cambiar el cursor cuando esté encima del link
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>¡Registra <span style={{ color: colors.third }}><strong>tu carro</strong></span>!</Title>

        <form>
          <InputField type="text" placeholder="Placa" />
          <InputField type="text" placeholder="Capacidad Vehículo" />
          <InputField type="email" placeholder="Marca" />
          <InputField type="tel" placeholder="Modelo" />
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button to="/agrega-foto-carro" label="Siguiente" primary />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterCar;
