import React, { useState } from 'react';
import colors from './colors';

const AddButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: isHovered ? colors.third : colors.primary,
    color: colors.white,
    fontSize: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `3px solid ${colors.details}`,
    boxShadow: isHovered
      ? '0px 6px 12px rgba(0, 0, 0, 0.3)'
      : '0px 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <div
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      +
    </div>
  );
};

export default AddButton;
