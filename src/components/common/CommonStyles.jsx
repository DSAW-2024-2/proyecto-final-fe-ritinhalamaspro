// src/components/CommonStyles.js
import styled from 'styled-components';
import colors from '../../assets/Colors';

export const Text = styled.p`
  text-align: center;
  margin: 20px;
  color: ${colors.white};
`;

export const Text1 = styled.p`
  margin: 6px;
  color: ${colors.white};
`;

export const Title = styled.h2`
  text-align: center;
  margin-top: 40px;
  font-size: 24px;
  color: ${colors.white};

`;

export const CircleImage = styled.div`
  width: ${(props) => props.size || '150px'};
  height: ${(props) => props.size || '150px'};
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.borderColor || colors.white};
  box-shadow: 0px 0px 15px ${colors.primary};
  margin: 80px 0;
  position: relative;
`;

export const Input = styled.input`
  width: 90%;
  border-radius: 10px;
  height: 2.5em;
  background-color: transparent;
  color: ${(props) => (props.hasText ? colors.white : colors.details)};
  border: 1px solid ${(props) => (props.isFocused ? colors.third : '#898A8D')};
  box-shadow: ${(props) => (props.isFocused ? `0 0 5px ${colors.third}` : 'none')};
  transition: border 0.3s ease, box-shadow 0.3s ease;
  padding: 0px 10px;
`;


export const CardContainer = styled.div`
  background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.156), rgba(0, 0, 0, 0.072));
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  width: 300px;
  margin: 0 auto;
  color: #898A8D;
  border: 1px solid #8d898c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
`;

export const FormLogin = styled.form`
  width: 80%;
  gap: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;

`;

export const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: white;
`;

export const PasswordConatiner = styled.div`
  position: relative;
   width: 100%;
   display:flex;

`;

export const InputContainer = styled.div`
  position: relative;
   width: 100%;
   display:flex;
   flex-direction: column;
`;


export const LinkStyle = styled.p`
  color: ${colors.third}; 
  text-decoration: underline;
  cursor: pointer;
  margin: 0;
`;

export const StyledAddButton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) => (props.isHovered ? colors.third : colors.primary)};
  color: ${colors.white};
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid ${colors.details};
  box-shadow: ${(props) => 
    props.isHovered ? 
      '0px 6px 12px rgba(0, 0, 0, 0.3)' : 
      '0px 4px 8px rgba(0, 0, 0, 0.2)'
  };
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover{
    background-color: ${colors.third};
  }
  bottom: -10px;
  right: -10px;
`;

export const StyledAddButton1 = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) => (props.isHovered ? colors.third : colors.primary)};
  color: ${colors.white};
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid ${colors.details};
  box-shadow: ${(props) => 
    props.isHovered ? 
      '0px 6px 12px rgba(0, 0, 0, 0.3)' : 
      '0px 4px 8px rgba(0, 0, 0, 0.2)'
  };
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover{
    background-color: ${colors.third};
  }
`;

export const Container =styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: ${colors.background};
  overflow: hidden;
`;

export const StyledWrapper = styled.div`
  .switch {
    --_switch-bg-clr: ${colors.details};
    --_switch-padding: 2px; /* padding alrededor del botón */
    --_slider-bg-clr: ${colors.third}; /* color del slider cuando el lado izquierdo está seleccionado */
    --_slider-bg-clr-on: ${colors.primary}; /* color del slider cuando el lado derecho está seleccionado */
    --_slider-txt-clr: #ffffff;
    --_label-padding: 0.5rem 1rem; /* reduce el tamaño global del switch */
    --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8); /* easing para el cambio */
    color: ${colors.white};
    width: fit-content;
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 9999px;
    cursor: pointer;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    isolation: isolate;
    margin: 20px;
  }

  .switch input[type="checkbox"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  .switch > span {
    display: grid;
    place-content: center;
    transition: opacity 300ms ease-in-out 150ms;
    padding: var(--_label-padding);
  }
  
  .switch::before,
  .switch::after {
    content: "";
    position: absolute;
    border-radius: inherit;
    transition: inset 150ms ease-in-out;
  }
  
  /* switch slider */
  .switch::before {
    background-color: var(--_slider-bg-clr);
    inset: var(--_switch-padding) 50% var(--_switch-padding) var(--_switch-padding);
    transition: inset 500ms var(--_switch-easing), background-color 500ms ease-in-out;
    z-index: -1;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.3);
  }
  
  /* switch bg color */
  .switch::after {
    background-color: var(--_switch-bg-clr);
    inset: 0;
    z-index: -2;
  }
  
  /* switch hover & focus */
  .switch:focus-within::after {
    inset: -0.15rem;
  }
  
  .switch:has(input:checked):hover > span:first-of-type,
  .switch:has(input:not(:checked)):hover > span:last-of-type {
    opacity: 1;
    transition-delay: 0ms;
    transition-duration: 100ms;
  }
  
  /* switch hover */
  .switch:has(input:checked):hover::before {
    inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 45%;
  }
  
  .switch:has(input:not(:checked)):hover::before {
    inset: var(--_switch-padding) 45% var(--_switch-padding) var(--_switch-padding);
  }
  
  /* checked - move slider to right */
  .switch:has(input:checked)::before {
    background-color: var(--_slider-bg-clr-on);
    inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 50%;
  }
  
  /* checked - set opacity */
  .switch > span:last-of-type,
  .switch > input:checked + span:first-of-type {
    opacity: 0.75;
  }
  
  .switch > input:checked ~ span:last-of-type {
    opacity: 1;
  }
`;

