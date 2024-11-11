// src/context/DriverContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const DriverContext = createContext();

// Hook personalizado para usar el contexto
export const useDriver = () => useContext(DriverContext);

// Proveedor del contexto
export const DriverProvider = ({ children }) => {
    const [isDriver, setIsDriver] = useState(false); // Estado global de "Pasajero/Conductor"

    const toggleDriverMode = () => {
        setIsDriver(prevIsDriver => !prevIsDriver); // Alternar el estado entre pasajero y conductor
    };

    return (
        <DriverContext.Provider value={{ isDriver, toggleDriverMode }}>
            {children}
        </DriverContext.Provider>
    );
};
