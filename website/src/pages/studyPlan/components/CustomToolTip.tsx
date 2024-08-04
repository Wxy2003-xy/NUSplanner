import React from 'react';

const CustomTooltip = ({ target, content }) => {
  // Example fixed position; adjust as needed.
  const style = {
    position: 'fixed',
    top: '20%', // Adjust based on desired location
    right: '20%',
    zIndex: 1000, // Ensure it's above other content
    padding: '10px',
    background: 'white',
    border: '1px solid black'
  };

  return (
    <div style={style}>
      {content}
    </div>
  );
};

export default CustomTooltip;