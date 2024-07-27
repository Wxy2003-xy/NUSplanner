import './Header.css'; 
import nusplannerLogo from '../images/nusplannerLogo.png'; 
import React from 'react';

function Header() {
  const monthInLetter = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date());
  const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' }); 

  return (<>
    <header className="Header">
      <div className="logo-container">
      <img src={nusplannerLogo} alt="Logo" className="App-logo" style={{ marginRight: 'auto' }} />
      </div>
      <div className='title-container'>
        <h1>Welcome to NUSPlanner</h1>
        <p >Make your customized study plan</p>
        <p>{new Date().getDate()} {monthInLetter} {new Date().getFullYear()},  {dayOfWeek}</p>
      </div>
    </header>
    </>
  );
}

export default Header;



