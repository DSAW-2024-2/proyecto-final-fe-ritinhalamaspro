// src/components/Text.jsx
import React from 'react';
import colors from './Colors'; // Asegúrate de importar el archivo de colores

const Text = ({ children }) => {
  const textStyle = {
    textAlign: 'center',
    marginTop: '20px',
    color: colors.white, // Usamos el color definido en colors.js
  };

  return <p style={textStyle}>{children}</p>;
};

export default Text;

