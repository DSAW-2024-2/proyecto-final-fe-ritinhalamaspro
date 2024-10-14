const ProfilePhoto = ({ imageUrl, size = '150px' }) => {
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: '50%',         // Makes the div circular
    overflow: 'hidden',          // Ensures the image doesn't overflow the circle
    display: 'flex',
    justifyContent: 'center',   // Centers the image horizontally
    alignItems: 'center',       // Centers the image vertically
    border: '2px solid #fff',   // Optional: adds a white border around the circle
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',  // Adds subtle shadow
    margin: '80px 0',            // Adds top and bottom margin
  };

  const imageStyle = {
    width: '100%',   // Makes sure the image fills the circle
    height: '100%',  // Makes sure the image fills the circle
    objectFit: 'cover',  // Ensures the image scales correctly without distorting
  };

  return (
    <div style={circleStyle}>
      <img src={imageUrl} alt="Profile" style={imageStyle} />
    </div>
  );
};

export default ProfilePhoto;
