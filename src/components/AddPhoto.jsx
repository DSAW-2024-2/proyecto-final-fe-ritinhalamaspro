import React, { useRef } from 'react';
import AddPhotoIcon from '../assets/addPhoto.svg'; // Asumiendo que el icono está en la carpeta assets
import colors from './colors'; // Importamos el archivo de colores
import AddButton from './AddButton';

const AddPhoto = ({ children }) => {
  const fileInputRef = useRef(null); // Creamos una referencia al input

  // Estilos del contenedor de la tarjeta
  const cardStyle = {
    background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.156), rgba(0, 0, 0, 0.072))',
    padding: '60px',
    borderRadius: '15px',
    boxShadow: `0 8px 16px rgba(0, 0, 0, 0.3)`,
    width: '100%',
    maxWidth: '250px',
    margin: '70px auto 70px',
    color: colors.details,
    border: `1px solid ${colors.third}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Para posicionar el icono y el botón
    flexDirection: 'column', // Asegura que el contenido se acomode en columna
    paddingBottom: '80px', // Añadimos padding para que el botón no se solape
  };

  // Estilos del icono
  const iconStyle = {
    width: '40px',    // Tamaño del icono
    height: '40px',
    fill: colors.details,
    cursor: 'pointer', // Para que el cursor cambie a mano
  };

  // Estilos del input para ocultarlo
  const inputStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0, // Hacemos el input invisible
    cursor: 'pointer', // Para que el cursor también sea de mano sobre el input
  };

  // Función para manejar el clic en el icono
  const handleIconClick = () => {
    fileInputRef.current.click(); // Simula un clic en el input de archivos
  };

  // Función para manejar el archivo seleccionado
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file);
      // Aquí puedes manejar la foto, como cargarla o mostrar una vista previa.
    }
  };

  return (
    <div style={cardStyle}>
      {/* Input de archivo invisible */}
      <input
        type="file"
        ref={fileInputRef}
        style={inputStyle}
        onChange={handleFileChange}
        accept="image/*" // Solo permite imágenes
      />
      <img
        src={AddPhotoIcon}
        alt="Add Photo"
        style={iconStyle}
        onClick={handleIconClick} 
      />
      
      {children}

      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '50px', 
        zIndex: '10' 
      }}>
        <AddButton />
      </div>
    </div>
  );
};

export default AddPhoto;
