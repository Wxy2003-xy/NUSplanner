import React, { useEffect, useState } from 'react';
import './about.css';
import Layout from '../../components/Layout';
import UnderConstruction from '../../components/UnderConstruction';

const About = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  return (
    <Layout>
      <div className="about-container">
        <div className="about-header">
          <h1>About Us</h1>
        </div>
        <div className="about-content">
          <section className="about-company-overview">
            <h2>Website Overview</h2>
            <p>Founded in 2024, NUSPlanner has emerged as a premier provider of Course Schedules and Timetables.</p>
          </section>
          <section className="about-motivation">
            <h2>Motivation</h2>
            <p>Transitioning from high school to college brings a myriad of course options, making it challenging for freshmen to plan their academic journey. Despite adapting to college life, scheduling courses that align with aspirations can be daunting. We thus aim to offer guidance to NUS students and incoming freshmen on course scheduling and timetable planning each semester.</p>
          </section>
          <section className="about-aim">
            <h2>Aim</h2>
            <p>We aim to introduce a cutting-edge recommendation system to guide NUS students in crafting their ideal course schedules and timetables tailored to their preferences and academic requirements. This system will offer comprehensive course schedules and insights into optimal timing for each course every semester.</p>
          </section>
          <section className="about-extension">
            <h2>Extension</h2>
            <p>NUSPlanner boasts a vibrant "Community" section for user engagement and interaction. It also includes essential QoL features such as a "Reminder" for daily notes and a "Map" for viewing the locations of class venues. Additionally, NUSPlanner offers a "Feedback" section where users can provide suggestions and report issues, ensuring continuous improvement.</p>
          </section>
          <section className="about-history">
            <h2>Our History</h2>
            <ul>
              <li>Home —— 2024/05</li>
              <li>StudyPlan, Feedback —— 2024/06</li>
              <li>TimeTable, Community, Reminder, Map —— 2024/07</li>
            </ul>
          </section>
          <section className="about-development-team">
            <h2>Development Team</h2>
            <div className="about-team-member">
              <h3>Zhang YuHao</h3>
              <h3>Wang XiYu</h3>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default About;


