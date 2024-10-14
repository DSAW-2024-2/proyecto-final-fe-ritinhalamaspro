// src/components/Text.jsx
import React from 'react';

const Text = ({ children }) => {
  const textStyle = {
    textAlign: 'center',
    marginTop: '20px',
    color: 'white',
  };

  return <p style={textStyle}>{children}</p>;
};

export default Text;
