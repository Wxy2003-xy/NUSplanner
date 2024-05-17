import React, { useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const DarkModeComponent: React.FC = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
      <DarkModeSwitch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size="5rem"
      />
    </div>
  );
};

export default DarkModeComponent;
