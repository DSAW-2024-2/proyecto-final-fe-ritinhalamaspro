// ProfilePhoto.jsx
import React from 'react';
import colors from './Colors'; // Importamos los colores
import AddButton from './AddButton'; // Asegúrate de que el AddButton esté bien importado

const ProfilePhoto = ({ imageUrl, size = '150px', borderColor = colors.white, boxShadowColor = 'rgba(0, 0, 0, 0.3)' }) => {
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: '50%',         // Hace el div circular
    overflow: 'hidden',          // Evita que la imagen se desborde del círculo
    display: 'flex',
    justifyContent: 'center',    // Centra la imagen horizontalmente
    alignItems: 'center',        // Centra la imagen verticalmente
    border: `2px solid ${borderColor}`,   // Borde ajustable con color dinámico
    boxShadow: `0px 0px 15px ${colors.primary}`,  // Sombra con el color primario
    margin: '80px 0',            // Margen superior e inferior
    position: 'relative',        // Para posicionar el botón en la parte inferior derecha
  };

  const imageStyle = {
    width: '100%',     // Asegura que la imagen llene el círculo
    height: '100%',    // Asegura que la imagen llene el círculo
    objectFit: 'cover', // Mantiene las proporciones de la imagen sin distorsión
    display: 'block',  // Asegura que la imagen se renderice como bloque y ocupe el espacio del contenedor
  };

  return (
    <div style={circleStyle}>
      <img src={imageUrl} alt="Profile" style={imageStyle} />

      {/* Botón en la parte inferior derecha */}
      <div style={{
        position: 'absolute',
        bottom: '10px',   // Ajustamos para que el botón no esté pegado al borde
        right: '10px',
        zIndex: '20',     // Asegura que el botón esté por encima de la imagen
      }}>
        
      </div>
    </div>
  );
};

export default ProfilePhoto;
