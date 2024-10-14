import React from 'react';

const Card = ({ children }) => {
  const cardStyle = {
    background: 'linear-gradient(to bottom right,rgba(0, 0, 0, 0.156) , rgba(0, 0, 0, 0.072))',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',  
    width: '100%',
    maxWidth: '350px',
    margin: '0 auto',
    color: '#898A8D',
    border: '1px solid #898A8D', 
  };

  return <div style={cardStyle}>{children}</div>;
};

export default Card;
