import React, { useState } from 'react';
import Card from '../components/Card';
import Title from '../components/Title';
import Button from '../components/Button';
import styled from 'styled-components';
import colors from '../components/colors';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import driverIcon from '../assets/driver.svg'; // Importa tu archivo SVG

const Role = () => {
  const [selectedRole, setSelectedRole] = useState("Conductor");
  const navigate = useNavigate(); // Cambiado a useNavigate

  const handleRoleSelection = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleNextClick = (e) => {
    e.preventDefault(); // Prevenir comportamientos predeterminados del botón si los hay
    console.log("Botón 'Siguiente' clickeado, Rol seleccionado:", selectedRole); // Asegura que el clic está registrado
    if (selectedRole === "Conductor") {
      navigate("/registrar-carro");
    } else {
      navigate("/pagina-principal");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      {/* Asegurarse de que el Card tenga posición relativa */}
      <Card style={{ position: 'relative' }}>
        <Title>¡Quiero tener el rol de <span style={{ color: '#D130FE' }}><strong>Conductor</strong></span>!</Title>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <StyledWrapper>
            <div className="radio-buttons-container">
              <div className="radio-button">
                <input
                  name="radio-group"
                  id="radio2"
                  className="radio-button__input"
                  type="radio"
                  value="No"
                  onChange={handleRoleSelection}
                />
                <label htmlFor="radio2" className="radio-button__label">
                  <span className="radio-button__custom" />
                  No
                </label>
              </div>

              <div className="radio-button">
                <input
                  name="radio-group"
                  id="radio1"
                  className="radio-button__input"
                  type="radio"
                  value="Conductor"
                  onChange={handleRoleSelection}
                  defaultChecked
                />
                <label htmlFor="radio1" className="radio-button__label">
                  <span className="radio-button__custom" />
                  Sí
                </label>
              </div>
            </div>
          </StyledWrapper>
        </div>

        {/* Mostrar el icono si es necesario */}
        <StyledIcon src={driverIcon} alt="Driver Icon" />
      </Card>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button label="Siguiente" primary onClick={(e) => handleNextClick(e)} />
      </div>
    </div>
  );
};

// Estilo para el icono y otros elementos
const StyledWrapper = styled.div`
  .radio-buttons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }

  .radio-button {
    display: inline-block;
    position: relative;
    cursor: pointer;
  }

  .radio-button__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .radio-button__label {
    display: inline-block;
    padding-left: 30px;
    margin-bottom: 10px;
    position: relative;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .radio-button__custom {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${colors.details};
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .radio-button__input:checked + .radio-button__label .radio-button__custom {
    transform: translateY(-50%) scale(0.9);
    border: 5px solid ${colors.third};
    color: ${colors.details};
  }

  .radio-button__input:checked + .radio-button__label {
    color: ${colors.third};
    font-size: 25px;
  }

  .radio-button__label:hover .radio-button__custom {
    transform: translateY(-50%) scale(1.2);
    border-color: ${colors.primary};
    box-shadow: 0 0 10px #D130FE80;
  }
`;

// Estilos para el icono
const StyledIcon = styled.img`
  width: 70px;  // Tamaño ajustable
  margin-top: 20px;
  transition: transform 0.3s ease-in-out;
  
`;

export default Role;
