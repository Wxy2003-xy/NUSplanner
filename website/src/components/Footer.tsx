import './Footer.css'; 
import React from 'react'
function Footer() {
    return (
        <div className='footer-box'>
        <footer>
            <p className='sym'>
                &copy; 
                {new Date().getFullYear()}
                NUSplanner
            </p>
        </footer>   
        
        </div>
    );
}

export default Footer