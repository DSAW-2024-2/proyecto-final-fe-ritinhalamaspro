// src/components/InputField.jsx
import React, { useState } from 'react';

const InputField = ({ type, placeholder, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = "w-full p-2.5 my-3 rounded-lg bg-transparent transition-all duration-300";
  const textColor = value ? "text-white" : "text-gray-400";
  const borderColor = isFocused ? "border-blue-500 shadow-lg" : "border-gray-500";
  const shadow = isFocused ? "shadow-lg" : "shadow-none";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`${baseClasses} ${textColor} border ${borderColor} ${shadow}`}
    />
  );
};

export default InputField;
