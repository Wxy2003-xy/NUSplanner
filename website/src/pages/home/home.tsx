import React, { useEffect } from 'react';
import './home.css';
import logoImage from '../../images/nusplannerLogo.png';
import { NavLink } from 'react-router-dom';
import Layout from '../../components/Layout';


const Home: React.FC = () => {
 useEffect(() => {
   function updateDate() {
     const dateElement = document.getElementById('current-date');
     const options: Intl.DateTimeFormatOptions = {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
     };
     const today = new Date();
     dateElement!.textContent = today.toLocaleDateString(undefined, options);
   }
   updateDate();
 }, []);


 return (
  <div>
    <Layout/>
   <div className="home-container">
       <div className="date-container">
         <span id="current-date"></span>
       </div>

         <div className="nav-right">
           <div>
             <h2>NUSPlanner</h2>
             <p>Your Smart StudyPlan & TimeTable Designer</p>
           </div>
         </div>
   </div>
</div>
 );
};


export default Home;
