// src/components/Title.jsx
import React from 'react';
import colors from './Colors'; // Asegúrate de importar el archivo de colores

const Title = ({ children }) => {
  const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: colors.white, // Usamos el color definido en colors.js
  };

  return <h2 style={titleStyle}>{children}</h2>;
};

export default Title;
