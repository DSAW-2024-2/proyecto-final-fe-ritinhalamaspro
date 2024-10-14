import React from 'react';
import Card from '../components/Card';
import { useHistory } from 'react-router-dom';
import ConfirmationIcon from '../assets/confirmation.svg'; 
import ErrorIcon from '../assets/error.svg'; 

const FeedbackModal = ({ type = 'confirmacion', message, details, onClose }) => {
  const history = useHistory();

  const modalOverlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, 
  };

  const modalCardStyles = {
    width: '400px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: 'white',
    textAlign: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const iconStyles = {
    width: '60px',
    height: '60px',
    margin: '0 auto 20px auto',
  };

  const buttonStyles = {
    backgroundColor: type === 'error' ? '#7a115081' : '#26642274',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '15px',
  };

  const handleButtonClick = () => {
    if (type === 'error') {
      history.goBack(); // Go back if error
    } else {
      onClose(); // Close modal for confirmation
    }
  };

  return (
    <div style={modalOverlayStyles}>
      <Card style={modalCardStyles}>
        <div>
          <img
            src={type === 'error' ? ErrorIcon : ConfirmationIcon}
            alt={type === 'error' ? 'Error' : 'Confirmation'}
            style={iconStyles}
          />
          <h3>{type === 'error' ? '¡Error!' : '¡Confirmación!'}</h3>
          <p>{message}</p>
          {details && <p><strong>Detalles:</strong> {details}</p>}
          <button style={buttonStyles} onClick={handleButtonClick}>
            {type === 'error' ? 'Volver a la página anterior' : '¡Listo!'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackModal;
