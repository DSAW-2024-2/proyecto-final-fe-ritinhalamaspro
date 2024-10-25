// src/components/CommonStyles.js
import styled from 'styled-components';
import colors from '../assets/colors';

export const Text = styled.p`
  text-align: center;
  margin-top: 20px;
  color: ${colors.white};
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
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
  padding: 10px;
  margin: 12px 0;
  border-radius: 13px;
  background-color: transparent;
  color: ${(props) => (props.hasText ? colors.white : colors.details)};
  border: 1px solid ${(props) => (props.isFocused ? colors.third : '#898A8D')};
  box-shadow: ${(props) => (props.isFocused ? `0 0 5px ${colors.third}` : 'none')};
  transition: border 0.3s ease, box-shadow 0.3s ease;
`;

export const CardContainer = styled.div`
  background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.156), rgba(0, 0, 0, 0.072));
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 270px;
  margin: 0 auto;
  color: #898A8D;
  border: 1px solid #8d898c;
`;
