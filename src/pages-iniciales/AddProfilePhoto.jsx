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
  const [selectedImage, setSelectedImage] = useState("src/assets/PofilePhoto.png");


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);  
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <Title>Agrega tu foto</Title>
        <form>
          <div style={profileContainerStyle}>
            <ProfilePhoto
              imageUrl={selectedImage} 
              size="170px"
            />

            <div style={addButtonContainerStyle}>
              <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                <AddButton />
              </label>
              <input
                type="file"
                id="imageUpload"
                style={{ display: 'none' }} 
                onChange={handleImageUpload} 
                accept="image/*"  
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
