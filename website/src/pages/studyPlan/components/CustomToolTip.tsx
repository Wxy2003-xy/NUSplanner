import React from 'react';

const CustomTooltip = ({ target, content }) => {
  
  const style = {
    position: 'fixed',
    top: '20%', 
    right: '20%',
    zIndex: 1000, 
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