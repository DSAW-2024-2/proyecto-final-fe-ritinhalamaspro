import React, { useState } from 'react';
import color from './colors';

const InputField = ({ type, placeholder, value, onChange }) => {
  const [hasText, setHasText] = useState(false);  // Estado para saber si hay texto
  const [isFocused, setIsFocused] = useState(false);  // Estado para saber si el campo está enfocado

  const handleInputChange = (e) => {
    setHasText(e.target.value !== '');  // Verifica si hay texto en el input
    if (onChange) onChange(e);  // Llama al onChange del componente padre
  };

  const inputStyle = {
    width: '90%',
    padding: '10px',
    margin: '12px 0',
    borderRadius: '13px',
    backgroundColor: 'transparent',
    color: hasText ? color.white : color.details,  // Cambia el color del texto si hay texto
    border: `1px solid ${isFocused ? color.third : '#898A8D'}`,  // Cambia el borde si está enfocado
    boxShadow: isFocused ? `0 0 5px ${color.third}` : 'none',  // Pequeña sombra cuando está en focus
    transition: 'border 0.3s ease, box-shadow 0.3s ease'  // Transición suave
  };

  return (
    <input
      style={inputStyle}
      type={type}
      placeholder={placeholder}
      value={value}  // Recibe el valor desde el padre
      onChange={handleInputChange}  // Detecta cambios en el input
      onFocus={() => setIsFocused(true)}  // Marca como enfocado
      onBlur={() => setIsFocused(false)}  // Marca como desenfocado
    />
  );
};

export default InputField;
