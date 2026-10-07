import React from 'react';
import { ArrowUpRight, BookOpen, Calendar, Compass, Heart, Users } from 'react-feather';
import Layout from '../../components/Layout';
import './about.css';

const milestones = [
  { date: 'May 2024', title: 'A home for the idea', detail: 'The first NUSPlanner experience went live.' },
  { date: 'June 2024', title: 'Planning became practical', detail: 'Study planning and feedback tools joined the project.' },
  { date: 'July 2024', title: 'The campus toolkit grew', detail: 'Timetable, community, reminders and the map arrived.' },
];

const credits = [
  ['Home icon', 'https://www.flaticon.com/free-icons/home-button', 'Freepik'],
  ['Timetable icon', 'https://www.flaticon.com/free-icons/timetable', 'Prosymbols Premium'],
  ['Planner icon', 'https://www.flaticon.com/free-icons/files-and-folders', 'Arkinasi'],
  ['Reminder icon', 'https://www.flaticon.com/free-icons/planner', 'Nsu Rabo Elijah'],
  ['Map icon', 'https://www.flaticon.com/free-icons/map', 'Pixel perfect'],
  ['Community icon', 'https://www.flaticon.com/free-icons/community', 'KP Arts'],
  ['Feedback icon', 'https://www.flaticon.com/free-icons/feedback', 'Freepik'],
  ['About icon', 'https://www.flaticon.com/free-icons/about', 'Elite Art'],
];

const About = () => (
  <Layout>
    <div className="page-shell about-page">
      <section className="about-hero">
        <div>
          <p className="page-eyebrow">Our story</p>
          <h1>Planning should open doors, not create detours.</h1>
        </div>
        <p>
          NUSPlanner is a student-built workspace for making sense of course choices, prerequisites,
          timetables, and the everyday logistics around them.
        </p>
      </section>

      <section className="about-principles" aria-label="What NUSPlanner stands for">
        <article>
          <span><BookOpen size={20} /></span>
          <h2>Clarity first</h2>
          <p>Turn years of course choices into a plan you can scan, test, and change.</p>
        </article>
        <article>
          <span><Compass size={20} /></span>
          <h2>Made for real campus life</h2>
          <p>Connect the academic plan to time, place, deadlines, and daily routines.</p>
        </article>
        <article>
          <span><Users size={20} /></span>
          <h2>Built with students</h2>
          <p>Shape the product through shared knowledge, feedback, and lived experience.</p>
        </article>
      </section>

      <section className="about-story-grid">
        <article className="about-story-card surface-card">
          <p className="page-eyebrow">Why it exists</p>
          <h2>A better starting point for every student.</h2>
          <p>
            The leap from school to university comes with hundreds of possible modules and a maze of
            dependencies. One missed foundation course can disrupt plans several semesters later.
            NUSPlanner was created to surface those relationships earlier, while choices are still easy to change.
          </p>
          <p>
            Our aim is simple: help students make informed course and timetable decisions that reflect
            both academic requirements and the way they want to live and learn.
          </p>
        </article>

        <aside className="about-team-card">
          <span className="about-heart"><Heart size={21} /></span>
          <p className="page-eyebrow">The student team</p>
          <h2>Small team.<br />Long horizon.</h2>
          <div className="about-team-list">
            <div><strong>Zhang YuHao</strong><span>Co-creator</span></div>
            <div><strong>Wang XiYu</strong><span>Co-creator</span></div>
          </div>
        </aside>
      </section>

      <section className="about-timeline-section">
        <div className="about-section-title">
          <div>
            <p className="page-eyebrow">The journey so far</p>
            <h2>Built one useful step at a time.</h2>
          </div>
          <Calendar size={26} />
        </div>
        <div className="about-timeline">
          {milestones.map((milestone, index) => (
            <article key={milestone.date}>
              <span className="about-timeline-index">0{index + 1}</span>
              <time>{milestone.date}</time>
              <h3>{milestone.title}</h3>
              <p>{milestone.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <details className="about-credits surface-card">
        <summary>Image and icon credits</summary>
        <div className="about-credit-grid">
          {credits.map(([label, href, creator]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
              <span><strong>{label}</strong><small>{creator} · Flaticon</small></span>
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </details>
    </div>
  </Layout>
);

export default About;
