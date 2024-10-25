import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from './Colors'; // Importamos el archivo de colores

// Estilo para el botón utilizando styled-components
const StyledButton = styled.button`
  background-color: ${(props) => 
    props.disabled ? '#3f1ee46d' : 
    props.primary ? (props.isHovered ? colors.primaryHover : colors.primary) : 'transparent'};
  color: ${(props) => (props.disabled ? '#666666' : colors.white)};
  border: ${(props) => (props.primary ? 'none' : `1px solid ${colors.primary}`)};
  border-radius: 11px;
  padding: 10px 20px;
  margin: 8px;
  width: ${(props) => (props.fullWidth ? '100%' : '230px')};
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease, color 0.3s ease;
  box-shadow: ${(props) => (props.isHovered && !props.disabled ? '0px 11px 5px rgba(0, 0, 0, 0.7)' : '0px 2px 10px rgba(0, 0, 0, 0.247)')};
`;

const Button = ({ to, label, primary = false, onClick, fullWidth = false, disabled = false, ...rest }) => { 
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const buttonProps = {
    primary,
    isHovered,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    fullWidth,
    disabled,
    ...rest,
  };

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        <StyledButton {...buttonProps} disabled={disabled}>
          {label}
        </StyledButton>
      </Link>
    );
  }

  return (
    <StyledButton {...buttonProps} onClick={onClick} disabled={disabled}>
      {label}
    </StyledButton>
  );
};

export default Button;
