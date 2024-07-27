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
        <div className='credit-section'>
            <h3>credit: </h3>
            home icon <a href="https://www.flaticon.com/free-icons/home-button" title="home button icons">Freepik - Flaticon</a>
            timetable icon<a href="https://www.flaticon.com/free-icons/timetable" title="timetable icons">Prosymbols Premium - Flaticon</a>
            planner icon<a href="https://www.flaticon.com/free-icons/files-and-folders" title="files and folders icons">Arkinasi - Flaticon</a>
            reminder icon<a href="https://www.flaticon.com/free-icons/planner" title="planner icons">Nsu Rabo Elijah - Flaticon</a>
            map icon<a href="https://www.flaticon.com/free-icons/map" title="map icons">Pixel perfect - Flaticon</a>
            community icon<a href="https://www.flaticon.com/free-icons/community" title="community icons">KP Arts - Flaticon</a>
            feedback icon<a href="https://www.flaticon.com/free-icons/feedback" title="feedback icons">Freepik - Flaticon</a>
            about icon<a href="https://www.flaticon.com/free-icons/about" title="about icons">Elite Art - Flaticon</a>
        </div>
        </div>
    );
}

export default Footer