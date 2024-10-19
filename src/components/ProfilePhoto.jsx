import React from 'react';
import colors from './colors'; 

const ProfilePhoto = ({ imageUrl, size = '150px', borderColor = colors.white, boxShadowColor = 'rgba(0, 0, 0, 0.3)' }) => {
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: '50%',         
    overflow: 'hidden',          
    display: 'flex',
    justifyContent: 'center',    
    alignItems: 'center',       
    border: `2px solid ${borderColor}`,   
    boxShadow: `0px 0px 15px ${colors.primary}`,  
    margin: '80px 0',            
    position: 'relative',       
  };

  const imageStyle = {
    width: '100%',   
    height: '100%',  
    objectFit: 'cover',  
  };

  return (
    <div style={circleStyle}>
      <img src={imageUrl} alt="Profile" style={imageStyle} />
    </div>
  );
};

export default ProfilePhoto;
