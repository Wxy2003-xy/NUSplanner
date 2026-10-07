import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  Calendar,
  ExternalLink,
  Home,
  Info,
  MapPin,
  Menu,
  MessageCircle,
  Users,
  X,
} from 'react-feather';
import logoImage from '../images/nusplannerLogo.png';
import './Layout.css';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
  notice?: ReactNode;
};

const primaryNavigation = [
  { path: '/', label: 'Home', icon: Home, end: true },
  { path: '/studyplan', label: 'Study plan', icon: BookOpen },
  { path: '/timetable', label: 'Timetable', icon: Calendar },
  { path: '/reminder', label: 'Reminders', icon: Bell },
  { path: '/map', label: 'Campus map', icon: MapPin },
];

const secondaryNavigation = [
  { path: '/community', label: 'Community', icon: Users },
  { path: '/feedback', label: 'Feedback', icon: MessageCircle },
  { path: '/about', label: 'About', icon: Info },
];

const Layout: React.FC<LayoutProps> = ({ children, notice }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentDate = useMemo(
    () => new Intl.DateTimeFormat('en-SG', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date()),
    [],
  );

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const renderNavigation = (items: typeof primaryNavigation) => items.map(({ path, label, icon: Icon, end }) => (
    <NavLink
      key={path}
      to={path}
      end={end}
      className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}
    >
      <Icon size={19} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  ));

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="app-brand" aria-label="NUSPlanner home">
          <span className="app-brand-mark">
            <img src={logoImage} alt="" />
          </span>
          <span className="app-brand-copy">
            <strong>NUSPlanner</strong>
            <small>Plan with confidence</small>
          </span>
        </NavLink>

        <div className="app-header-actions">
          <span className="app-date">{currentDate}</span>
          <a
            className="app-campus-link"
            href="https://canvas.nus.edu.sg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Canvas <ExternalLink size={14} aria-hidden="true" />
          </a>
          <button
            className="app-menu-button"
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="app-navigation"
            aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className="app-body">
        <button
          type="button"
          aria-label="Close navigation"
          className={`app-nav-backdrop${isMenuOpen ? ' is-visible' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <aside id="app-navigation" className={`app-sidebar${isMenuOpen ? ' is-open' : ''}`}>
          <nav className="app-navigation" aria-label="Main navigation">
            <div className="app-nav-group">
              <p className="app-nav-label">Plan</p>
              {renderNavigation(primaryNavigation)}
            </div>
            <div className="app-nav-group app-nav-group-secondary">
              <p className="app-nav-label">Connect</p>
              {renderNavigation(secondaryNavigation)}
            </div>
          </nav>

          <a
            className="app-community-card"
            href="https://t.me/+c2TQvkafNAIzYmY9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="app-community-icon"><MessageCircle size={18} aria-hidden="true" /></span>
            <span>
              <strong>Join the student chat</strong>
              <small>Ideas, help and updates</small>
            </span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </aside>

        <main className="app-main" id="main-content">
          {notice}
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
