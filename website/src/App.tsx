import { lazy, Suspense } from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/home/home'));
const StudyPlan = lazy(() => import('./pages/studyPlan/studyplan'));
const Timetable = lazy(() => import('./pages/timetable/timetable'));
const Feedback = lazy(() => import('./pages/feedback/feedback'));
const About = lazy(() => import('./pages/about/about'));
const Community = lazy(() => import('./pages/community/community'));
const Reminder = lazy(() => import('./pages/reminder/reminder'));
const Map = lazy(() => import('./pages/map/map'));

const PageLoader = () => (
  <div className="route-loader" role="status" aria-live="polite">
    <span className="route-loader-mark" />
    <span>Preparing your planner…</span>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/studyPlan" element={<StudyPlan />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/map" element={<Map />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
