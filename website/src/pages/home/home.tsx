import React from 'react';
import Layout from '../../components/Layout'; // Adjust the path as needed
import './home.css'
const Home: React.FC = () => {
  return (
    <Layout>
      <div className="home-nav-right">
        <div>
          <h2>NUSPlanner</h2>
          <p>Your Smart StudyPlan & TimeTable Designer</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
