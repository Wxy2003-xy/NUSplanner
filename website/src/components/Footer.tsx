import './Footer.css'; 
import React from 'react'
function Footer() {

    return (
        <footer>
            <p>
                &copy; 
                {new Date().getFullYear()}
                NUSplanner
            </p>
        </footer>
    );
}

export default Footer