import React from 'react';
import color from './colors';

const InputField = ({ type, placeholder }) => {
  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '12px 0',
    border: '1px solid #898A8D',
    borderRadius: '13px',
    backgroundColor: 'transparent',
    color: color.details,
    border: '1px solid #898A8D'
  };



  return (
    <input
      style={inputStyle}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default InputField;
