import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import Title from '../components/Title';
import Text from '../components/Text';
import AddPhoto from '../components/AddPhoto';
import colors from '../components/colors'; // Importamos el archivo de colores

const AddSoatPhoto = () => {
  const linkStyle = {
    color: colors.third, // Usamos la variable de color para el enlace
    textDecoration: 'underline', // Subrayado por defecto
    cursor: 'pointer',           // Cambia el cursor cuando está encima del link
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)' 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>¡Agrega una foto de <span style={{ color: colors.third }}><strong>tu SOAT vigente</strong></span>!</Title>

        <form>
          <AddPhoto />
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button to="/pagina-principal" label="¡Listo!" primary />
        </div>
      </Card>
    </div>
  );
};

export default AddSoatPhoto;
