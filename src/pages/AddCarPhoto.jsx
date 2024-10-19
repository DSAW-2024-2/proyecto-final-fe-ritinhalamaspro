import React from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Title from '../components/Title';
import Text from '../components/Text';
import AddPhoto from '../components/AddPhoto';
import colors from '../components/colors'; // Importamos el archivo de colores

const AddCarPhoto = () => {
  const linkStyle = {
    color: colors.third,           // Usamos el color definido en colors.js
    textDecoration: 'underline',   // Subrayado por defecto
    cursor: 'pointer',             // Cambia el cursor cuando esté encima del link
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)', // Añade sombra para un efecto sutil
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>
          ¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu Carro</strong></span>!
        </Title>

        <form>
          <AddPhoto />
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button to="/agrega-foto-soat" label="Siguiente" primary />
        </div>

        
      </Card>
    </div>
  );
};

export default AddCarPhoto;
