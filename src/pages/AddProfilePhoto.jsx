import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import ProfilePhoto from '../components/ProfilePhoto';
import { Link } from 'react-router-dom';
import AddButton from '../components/AddButton';
import colors from '../components/colors';

const AddProfilePhoto = () => {
  // Estado para almacenar la imagen seleccionada
  const [selectedImage, setSelectedImage] = useState("src/assets/PofilePhoto.png");

  // Función para manejar la selección de imagen
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);  // Actualizar el estado con la nueva imagen
    }
  };

  const profileContainerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column', // Alinear de forma vertical
    justifyContent: 'center',
    alignItems: 'center',    // Centrar horizontalmente
    width: '100%',
    marginBottom: '20px',
  };

  // Contenedor para el AddButton
  const addButtonContainerStyle = {
    position: 'absolute',  // Posición absoluta dentro del contenedor
    top: '210px',          // Ajustar la distancia desde la parte superior del contenedor
    left: '60%',           // Centrar horizontalmente
    transform: 'translateX(-50%)', // Ajuste de posición horizontal
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>Agrega tu foto</Title>
        <form>
          <div style={profileContainerStyle}>
            <ProfilePhoto
              imageUrl={selectedImage}  // Usar la imagen seleccionada
              size="170px"
            />
            {/* Contenedor centrado para el AddButton */}
            <div style={addButtonContainerStyle}>
              <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                <AddButton />
              </label>
              <input
                type="file"
                id="imageUpload"
                style={{ display: 'none' }} // Ocultar el input
                onChange={handleImageUpload} // Manejar el evento de selección
                accept="image/*"  // Aceptar solo imágenes
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button to="/rol" label="¡Listo!" primary />
          </div>
        </form>
        <Text>
          <Link to="/rol" style={{ color: colors.third, textDecoration: 'underline', cursor: 'pointer', boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.2)' }}>Omitir</Link>
        </Text>
      </Card>
    </div>
  );
};

export default AddProfilePhoto;
