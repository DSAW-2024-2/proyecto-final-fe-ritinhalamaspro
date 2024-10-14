
import React from 'react';
import AddPhotoIcon from '../assets/addPhoto.svg'; // Assuming the icon is in the assets folder

const AddPhoto = ({ children }) => {
  const cardStyle = {
    background: 'linear-gradient(to bottom right,rgba(0, 0, 0, 0.156) , rgba(0, 0, 0, 0.072))',
    padding: '60px',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',  
    width: '100%',
    maxWidth: '250px',
    margin: '0 auto',
    color: '#898A8D',
    border: '1px solid #D130FE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const iconStyle = {
    width: '40px',    // Set the size of the SVG icon
    height: '40px',
    fill: '#898A8D', // Icon color
  };

  return (
    <div style={cardStyle}>
      <img src={AddPhotoIcon} alt="Add Photo" style={iconStyle} />
      {children}
    </div>
  );
};

export default AddPhoto;
