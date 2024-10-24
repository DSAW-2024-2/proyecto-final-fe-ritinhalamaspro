import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Title from '../components/Title';
import Text from '../components/Text';
import ProfilePhoto from '../components/ProfilePhoto';
import AddButton from '../components/AddButton';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para redireccionar
import Loader from '../components/Loader'; // Importa el componente Loader

const ProfileInfo = () => {
  const [profileData, setProfileData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const navigate = useNavigate(); // Hook para redirigir

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (token) {
      setIsLoggedIn(true);
      fetchProfileData(token); // Pasar el token para obtener los datos del perfil
    } else {
      setIsLoggedIn(false);
      setLoading(false); // Detener el estado de carga si no hay token
    }
  }, []);

  const fetchProfileData = async (token) => {
    try {
      const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Añadir el token en el header
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del perfil');
      }

      const data = await response.json();
      console.log("URL de la imagen:", data.photoURL); // Verifica que la URL esté presente y sea correcta

      setProfileData(data);
      setImage(data.photoURL); // Asume que 'photo' es el campo de la imagen en la respuesta de la API
      console.log('Imagen actual:', image);

      setLoading(false); // Detener el estado de carga después de obtener los datos
    } catch (error) {
      console.error('Error:', error);
      setLoading(false); // Detener el estado de carga en caso de error
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      // Hacer la solicitud POST para cerrar sesión
      await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Enviar el token en los headers
        },
      });

      // Eliminar el token del localStorage
      localStorage.removeItem('token');

      // Redirigir al usuario a la página de inicio de sesión
      navigate('/iniciar-sesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
    top: '-40px',
    left: '-40px',
    cursor: 'pointer',
  };

  const profilePhotoContainerStyle = {
    position: 'absolute',
    top: '-85px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '1',
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Actualiza la imagen de perfil con la seleccionada
      };
      reader.readAsDataURL(file);
    }
  };

  // Si el usuario no está logueado
  if (!isLoggedIn && !loading) {
    return <div>Por favor inicia sesión para ver tu perfil.</div>;
  }

  // Mostrar el estado de carga mientras se obtiene la información
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader /> {/* Reemplaza el texto "Cargando..." con el componente Loader */}
      </div>
    );
  }

  // Verificación adicional para evitar el error de nulos
  if (!profileData) {
    return <div>No se pudieron cargar los datos del perfil.</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ position: 'relative', paddingTop: '80px' }}>
        <div style={profilePhotoContainerStyle}>
          <ProfilePhoto
            imageUrl={image ? image : 'src/assets/PofilePhoto.png'} // Usa la imagen devuelta por la API o la predeterminada
            size="170px"
          />
        </div>
        <Title>
          {profileData.name && profileData.surName
            ? `${capitalizeFirstLetter(profileData.name)} ${capitalizeFirstLetter(profileData.surName)}`
            : 'Nombre no disponible'}
        </Title>
        <form>
          <div style={profileContainerStyle}>
            <div style={addButtonContainerStyle}>
              <label htmlFor="imageUpload">
                
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
          <Text>ID: {profileData.universityID ? profileData.universityID : 'ID no disponible'}</Text>
          <Text>Correo: {profileData.email ? profileData.email : 'Correo no disponible'}</Text>
          <Text>Teléfono: {profileData.phoneNumber ? profileData.phoneNumber : 'Teléfono no disponible'}</Text>
          <img src={image} alt="Profile" />

        </form>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button label="Cerrar Sesión" primary onClick={handleLogout} />
        </div>
      </Card>
    </div>
  );
};

export default ProfileInfo;
