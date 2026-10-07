import React from 'react';
import { BookOpen, Move, Search } from 'react-feather';
import Layout from '../../components/Layout';
import DynamicTable from './components/DynamicTable';
import './studyplan.css';

const StudyPlan: React.FC = () => (
  <Layout>
    <div className="studyplan-page">
      <div className="page-heading studyplan-heading">
        <div>
          <p className="page-eyebrow">Degree planner</p>
          <h1>Build the path, semester by semester.</h1>
          <p className="page-description">Add courses, spot prerequisite gaps, and drag modules between semesters until the plan feels right.</p>
        </div>
        <div className="studyplan-flow" aria-label="How to use the study planner">
          <span><i>1</i><Search size={14} /> Add</span>
          <b />
          <span><i>2</i><Move size={14} /> Arrange</span>
          <b />
          <span><i>3</i><BookOpen size={14} /> Review</span>
        </div>
      </div>
      <section className="studyplan-workspace surface-card" aria-label="Interactive study plan">
        <DynamicTable />
      </section>
    </div>
  </Layout>
);

export default StudyPlan;
