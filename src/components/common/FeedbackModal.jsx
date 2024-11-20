import React from 'react';
import PropTypes from 'prop-types';
import confirmationIcon from '../../assets/confirmation.svg';
import errorIcon from '../../assets/error.svg';
import questionIcon from '../../assets/question.svg'; // Ícono para el modal de tipo question
import colors from '../../assets/Colors';
import { Text, Title } from './CommonStyles';
import Button from './Button'; // Importamos el botón personalizado

const FeedbackModal = ({ type, message, details, onClose, onConfirm }) => {
  let icon;
  let confirmLabel = 'Aceptar';
  let cancelLabel = 'Cancelar';

  switch (type) {
    case 'confirmation':
      icon = confirmationIcon;
      confirmLabel = '¡Listo!';
      cancelLabel = null;
      break;
    case 'error':
      icon = errorIcon;
      confirmLabel = 'Volver a Página Anterior';
      cancelLabel = null;
      break;
    case 'question':
      icon = questionIcon;
      break;
    default:
      icon = confirmationIcon;
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContainer, ...styles[type] }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={icon} alt={`${type} icon`} style={styles.modalIcon} />
        </div>
        <Title>{message}</Title>
        <Text>{details}</Text>
        <div style={styles.buttonContainer}>
          {type === 'question' ? (
            <>
              <Button label={cancelLabel} onClick={onClose} primary={false} />
              <Button label={confirmLabel} onClick={onConfirm} primary={true} />
            </>
          ) : (
            <Button label={confirmLabel} onClick={onClose} primary={true} />
          )}
        </div>
      </div>
    </div>
  );
};

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
    backgroundColor: colors.background,
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0px 11px 5px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    color: colors.white,
    maxWidth: '400px',
    width: '100%',
  },
  confirmation: {
    border: `3px solid ${colors.primary}`,
  },
  error: {
    border: `3px solid ${colors.third}`,
  },
  question: {
    border: `3px solid ${colors.details}`, // Estilo personalizado para el tipo question
  },
  modalIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
};

// Definición de tipos para las props
FeedbackModal.propTypes = {
  type: PropTypes.oneOf(['confirmation', 'error', 'question']).isRequired,
  message: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func, // onConfirm es opcional para el tipo confirmation
};

export default FeedbackModal;
