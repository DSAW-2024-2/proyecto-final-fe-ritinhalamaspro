// src/components/Title.jsx
import React from 'react';

const Title = ({ children }) => {
  const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: 'white',
  };

  return <h2 style={titleStyle}>{children}</h2>;
};

export default Title;
