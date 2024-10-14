import React from 'react';

const InputField = ({ type, placeholder }) => {
  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '12px 0',
    border: '1px solid #898A8D',
    borderRadius: '13px',
    backgroundColor: 'transparent',
    color: '#898A8D',
    border: '1px solid #898A8D'
  };

  const placeholderStyle = {
    color: '#7f7f7f',
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
