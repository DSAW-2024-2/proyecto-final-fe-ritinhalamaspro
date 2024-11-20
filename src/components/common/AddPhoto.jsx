import React, { useRef, useState } from 'react';
import AddPhotoIcon from '../../assets/addPhoto.svg'; // Asumiendo que el icono está en la carpeta assets
import colors from '../../assets/Colors'; // Importamos el archivo de colores

const AddPhoto = ({ label, onPhotoChange }) => {
  const fileInputRef = useRef(null); // Creamos una referencia al input
  const [preview, setPreview] = useState(null); // Estado para la vista previa de la imagen

  // Estilos del contenedor de la tarjeta
  const cardStyle = {
    background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.156), rgba(0, 0, 0, 0.072))',
    borderRadius: '15px',
    boxShadow: `0 8px 16px rgba(0, 0, 0, 0.3)`,
    width: '100%',
    height:'10em',
    margin: '70px auto 70px',
    color: colors.details,
    border: `1px solid ${colors.third}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Para posicionar el icono y el botón
    flexDirection: 'column', // Asegura que el contenido se acomode en columna
  };

  // Estilos del icono y de la imagen de vista previa
  const iconStyle = {
    width: '40px',
    height: '40px',
    fill: colors.details,
    cursor: 'pointer', // Para que el cursor cambie a mano
  };

  const previewStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Para que la imagen encaje en el contenedor
    borderRadius: '10px',
    overflow:'hidden', // Asegura que la imagen esté por encima del ícono
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
      const fileURL = URL.createObjectURL(file); // Creamos la URL de la imagen seleccionada
      setPreview(fileURL); // Actualizamos el estado con la URL de la imagen
      onPhotoChange(file); // Pasamos la imagen seleccionada al componente padre
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

      {/* Mostrar la vista previa si hay una imagen seleccionada, de lo contrario mostrar el ícono */}
      {preview ? (
        <img src={preview} alt="Vista previa" style={previewStyle} />
      ) : (
        <img
          src={AddPhotoIcon}
          alt="Add Photo"
          style={iconStyle}
          onClick={handleIconClick}
        />
      )}

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '50px',
        zIndex: '10'
      }}>

      </div>
    </div>
  );
};

export default AddPhoto;
