import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, label, primary }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: primary 
      ? (isHovered ? '#4050e5' : '#3A4BE0') 
      : (isHovered ? '#253194' : 'transparent'), 

    color: primary ? '#fff' : '#fff', 
    border: primary ? 'none' : '1px solid #3A4BE0',
    borderRadius: '11px',
    padding: '5px 20px',
    margin: '8px',
    width: '230px',
    fontSize: '16px',
    cursor: 'pointer', // Cambiar el cursor al pasar el mouse
    transition: 'background-color 0.3s ease, color 0.3s ease', 
    boxShadow: isHovered 
      ? '0px 11px 5px rgba(0, 0, 0, 0.7)' 
      : '0px 2px 10px rgba(0, 0, 0, 0.247)' 
  };

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {label}
      </button>
    </Link>
  );
};

export default Button;
