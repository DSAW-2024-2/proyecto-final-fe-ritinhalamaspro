import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import ProfilePhoto from '../components/common/ProfilePhoto';
import Loader from '../components/common/Loader';
import FeedbackModal from '../components/common/FeedbackModal';
import Button from '../components/common/Button';
import { Container, Text, Title, StyledWrapper, StyledAddButton, Input } from '../components/common/CommonStyles';
import Colors from '../assets/Colors';

const ProfileInfo = () => {
  const navigate = useNavigate();
  
  const [isPassenger, setIsPassenger] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [modalAction, setModalAction] = useState(''); // Nuevo estado para controlar la acción del modal

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchProfileData(token);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, [isPassenger]);

  const fetchProfileData = async (token) => {
    try {
      setLoading(true);
      const endpoint = isPassenger
        ? 'https://proyecto-final-be-ritinhalamaspro.vercel.app/users/me'
        : 'https://proyecto-final-be-ritinhalamaspro.vercel.app/cars/me';
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Error al obtener los datos del perfil');
      
      let data = await response.json();

      if (!isPassenger) {
        data = Object.values(data)[0];
      }

      setProfileData(data);
      setEditableData({
        name: data.name || '',
        surName: data.surName || '',
        phoneNumber: data.phoneNumber || '',
        password: data.password || '',
      });
      setImage(data.photoURL || data.carPhotoURL);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/iniciar-sesion');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const confirmLogout = () => {
    setModalAction('logout'); // Establece la acción como 'logout'
    setShowQuestionModal(true);
  };

  const closeModal = () => {
    setShowQuestionModal(false);
  };

  const togglePassenger = () => {
    setIsPassenger((prev) => !prev);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editableData)
      });

      if (!response.ok) throw new Error('Error al guardar los cambios en el perfil');
      
      fetchProfileData(token);
      setIsEditing(false);
      setShowQuestionModal(false);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleDeleteCar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://proyecto-final-be-ritinhalamaspro.vercel.app/cars/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Error al eliminar el carro');
      
      setIsPassenger(true);
      setShowDeleteModal(false);
      fetchProfileData(token);
    } catch (error) {
      console.error('Error al eliminar el carro:', error);
    }
  };

  const handleInputChange = (e) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
  };

  if (!isLoggedIn && !loading) {
    return <div>Por favor inicia sesión para ver tu perfil.</div>;
  }

  if (loading) {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            width: '100vw', 
            backgroundColor: Colors.background, 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            zIndex: 1000 
        }}>
            <Loader />
        </div>
    );
  }

  return (
    <Container>
      <div style={{
        position: 'relative',
        backgroundColor: Colors.background,
        width: '350px',
        padding: '30px 40px',
        borderRadius: '20px',
        boxShadow: '0px -3px 10px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        color: Colors.white,
        marginTop: '20px',
      }}>
        <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)' }}>
          <ProfilePhoto imageUrl={image ? image : 'src/assets/PofilePhoto.png'} size="120px" />
        </div>

        {isPassenger && !isEditing && (
          <StyledAddButton 
            onClick={handleEditProfile}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
          >
            <AiOutlineEdit size={16} />
          </StyledAddButton>
        )}

        {!isPassenger && profileData.plate && (
          <StyledAddButton 
            onClick={() => setShowDeleteModal(true)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
          >
            <AiOutlineDelete size={16} />
          </StyledAddButton>
        )}

        {!isEditing && isPassenger && (
          <div style={{ marginTop: '60px' }}>
            <Title>
              {`${profileData.name || 'Nombre no disponible'} ${profileData.surName || ''}`}
            </Title>
          </div>
        )}

        {isPassenger ? (
          <div style={{ textAlign: 'left', padding: '10px 0', marginTop:'40px'}}>
            {isEditing ? (
              <>
                <Input name="name" value={editableData.name} onChange={handleInputChange} placeholder="Nombre" style={{ marginBottom: '10px' }} />
                <Input name="surName" value={editableData.surName} onChange={handleInputChange} placeholder="Apellido" style={{ marginBottom: '10px' }} />
                <Input name="phoneNumber" value={editableData.phoneNumber} onChange={handleInputChange} placeholder="Teléfono" style={{ marginBottom: '10px' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <Button label="Cancelar" secondary onClick={handleCancelEdit} />
                  <Button label="Guardar" primary onClick={() => { setModalAction('save'); setShowQuestionModal(true); }} />
                </div>
              </>
            ) : (
              <>
                <Text>ID Universidad: {profileData.universityID || 'ID no disponible'}</Text>
                <Text>Correo Electrónico: {profileData.email || 'Correo no disponible'}</Text>
                <Text>Teléfono: {profileData.phoneNumber || 'Teléfono no disponible'}</Text>
              </>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'left', padding: '10px 0', color: Colors.details, marginTop: '10px' }}>
            {profileData.plate ? (
              <>
                <Text>Capacidad del vehículo: {profileData.capacity || 'Capacidad no disponible'}</Text>
                <Text>Marca: {profileData.brand || 'Marca no disponible'}</Text>
                <Text>Modelo: {profileData.model || 'Modelo no disponible'}</Text>
              </>
            ) :
             (
              <div style={{ textAlign: 'center', color: Colors.third, padding: '20px' }}>
                <Text>No tienes un carro registrado.</Text>
                <Button label="Registrar Carro" primary onClick={() => navigate('/registrar-carro')} style={{ marginTop: '10px' }} />
              </div>
            )}
          </div>
        )}

        {!isEditing && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', cursor: 'pointer' }} onClick={confirmLogout}>
            <AiOutlineLogout size={30} color={Colors.primary} />
            <Text style={{ marginTop: '5px', fontSize: '12px', color: Colors.details }}>Cerrar Sesión</Text>
          </div>
        )}
      </div>

      {showQuestionModal && (
        <FeedbackModal
          type="question"
          message={
            modalAction === 'logout' ? "¿Está seguro de que desea cerrar sesión?" : "¿Está seguro de querer guardar los cambios?"
          }
          details={
            modalAction === 'logout' ? "Si cierra sesión, deberá iniciar sesión nuevamente para acceder a su cuenta." : "Confirma para actualizar la información de tu perfil."
          }
          onClose={() => setShowQuestionModal(false)}
          onConfirm={modalAction === 'logout' ? handleLogout : handleSaveEdit}
        />
      )}

      {showDeleteModal && (
        <FeedbackModal
          type="question"
          message="¿Está seguro de que desea eliminar este carro?"
          details="Esta acción no se puede deshacer."
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteCar}
        />
      )}
      
      <StyledWrapper>
        <label className="switch" aria-label="Toggle Passenger/Car">
          <input type="checkbox" checked={!isPassenger} onChange={togglePassenger} />
          <span>Pasajero</span>
          <span>Carro</span>
        </label>
      </StyledWrapper>
    </Container>
  );
};

export default ProfileInfo;
