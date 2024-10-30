// FeedbackModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import confirmationIcon from '../../assets/confirmation.svg';
import errorIcon from '../../assets/error.svg';
import colors from '../../assets/Colors'; // Importamos los colores
import { Text, Title } from './CommonStyles';

const FeedbackModal = ({ type, message, details, onClose }) => {
  const icon = type === 'confirmation' ? confirmationIcon : errorIcon;

  console.log("Renderizando modal con tipo:", type);
  console.log("Mensaje del modal:", message);
  console.log("Detalles del modal:", details);

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContainer, ...styles[type] }}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src={icon} alt={`${type} icon`} style={styles.modalIcon} />
        </div>
        <Title>{message}</Title>
        <Text>{details}</Text>
        <button onClick={onClose} style={styles.modalButton}>
          {type === 'confirmation' ? '¡Listo!' : 'Volver a Página Anterior'}
        </button>
      </div>
    </div>
  );
};

// Estilos en línea
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: colors.background, // Usamos el color de fondo
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    color: colors.white, // Usamos el color blanco para el texto
    maxWidth: '400px',
    width: '100%',
  },
  confirmation: {
    border: `3px solid ${colors.primary}`, // Usamos el color primario para la confirmación
  },
  error: {
    border: `3px solid ${colors.third}`, // Usamos el color "tercero" para el error
  },
  modalIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
  },
  modalButton: {
    backgroundColor: colors.primary, // Usamos el color primario para el botón
    color: colors.white, // Usamos el color blanco para el texto del botón
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

// Definición de tipos para las props
FeedbackModal.propTypes = {
  type: PropTypes.oneOf(['confirmation', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FeedbackModal;
