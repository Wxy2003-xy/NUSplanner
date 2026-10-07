import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  ExternalLink,
  MapPin,
  Users,
} from 'react-feather';
import Layout from '../../components/Layout';
import campusImage from '../../images/NUS.jpeg';
import './home.css';

const tools = [
  {
    to: '/studyplan',
    label: 'Study plan',
    description: 'Map every semester, check prerequisites and track credits.',
    icon: BookOpen,
    accent: 'orange',
  },
  {
    to: '/timetable',
    label: 'Timetable',
    description: 'Turn a semester into a schedule that fits how you work.',
    icon: Calendar,
    accent: 'teal',
  },
  {
    to: '/reminder',
    label: 'Reminders',
    description: 'Keep deadlines and the small things in one private calendar.',
    icon: Bell,
    accent: 'blue',
  },
  {
    to: '/map',
    label: 'Campus map',
    description: 'See class venues in context before the semester starts.',
    icon: MapPin,
    accent: 'violet',
  },
];

const quickLinks = [
  { label: 'Canvas', href: 'https://canvas.nus.edu.sg' },
  { label: 'NUS email', href: 'https://exchange.nus.edu.sg' },
  { label: 'EduRec', href: 'https://myedurec.nus.edu.sg' },
];

const Home: React.FC = () => {
  const currentPeriod = new Intl.DateTimeFormat('en-SG', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <Layout>
      <div className="home-page">
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-kicker"><span /> Academic planning, minus the paperwork</p>
            <h1>See your degree.<br /><em>Shape your semester.</em></h1>
            <p className="home-hero-description">
              Build a course plan that makes sense, generate a timetable around your preferences,
              and keep campus life in one calm workspace.
            </p>
            <div className="home-hero-actions">
              <NavLink to="/studyplan" className="home-primary-action">
                Start planning <ArrowRight size={18} aria-hidden="true" />
              </NavLink>
              <NavLink to="/timetable" className="home-secondary-action">
                Open timetable
              </NavLink>
            </div>
            <div className="home-trust-row">
              <span><CheckCircle size={16} /> Uses current NUSMods data</span>
              <span><CheckCircle size={16} /> Saves on this device</span>
            </div>
          </div>

          <div className="home-hero-visual" style={{ backgroundImage: `url(${campusImage})` }}>
            <div className="home-visual-scrim" />
            <div className="home-visual-card">
              <div className="home-visual-card-top">
                <span>Planning snapshot</span>
                <span className="home-live-dot">Live</span>
              </div>
              <div className="home-stat-grid">
                <div><strong>8</strong><span>semesters</span></div>
                <div><strong>160</strong><span>target units</span></div>
                <div><strong>1</strong><span>clear plan</span></div>
              </div>
              <div className="home-progress-track"><span /></div>
              <p>Start with your major, then shape the details semester by semester.</p>
            </div>
          </div>
        </section>

        <section className="home-work-title-row">
          <div>
            <p className="page-eyebrow">Your planning toolkit</p>
            <h2>One place for the whole semester.</h2>
          </div>
          <NavLink to="/about">How it works <ArrowRight size={15} /></NavLink>
        </section>

        <section className="home-tool-grid" aria-label="Planner tools">
          {tools.map(({ to, label, description, icon: Icon, accent }) => (
            <NavLink key={to} to={to} className={`home-tool-card home-tool-${accent}`}>
              <span className="home-tool-icon"><Icon size={22} aria-hidden="true" /></span>
              <div>
                <h3>{label}</h3>
                <p>{description}</p>
              </div>
              <ArrowRight className="home-tool-arrow" size={19} aria-hidden="true" />
            </NavLink>
          ))}
        </section>

        <section className="home-lower-grid">
          <article className="home-next-card">
            <div className="home-card-heading">
              <span className="home-heading-icon"><Clock size={19} /></span>
              <div>
                <p className="page-eyebrow">Quick access</p>
                <h2>Campus essentials</h2>
              </div>
            </div>
            <p className="home-next-copy">The links you check most, without another round of searching.</p>
            <div className="home-quick-links">
              {quickLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </article>

          <article className="home-community-panel">
            <div>
              <span className="home-community-icon"><Users size={20} /></span>
              <p className="page-eyebrow">Student to student</p>
              <h2>Planning gets easier when knowledge is shared.</h2>
              <p>Ask a question, compare approaches or share what worked for you.</p>
            </div>
            <NavLink to="/community">Visit community <ArrowRight size={16} /></NavLink>
          </article>

          <article className="home-period-card">
            <Compass size={24} aria-hidden="true" />
            <span>Right now</span>
            <strong>{currentPeriod}</strong>
            <p>A good time to review the plan before registration gets busy.</p>
          </article>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
