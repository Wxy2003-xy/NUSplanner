import React, { useState, useEffect } from 'react';
import Joyride, { Step } from 'react-joyride';

interface GuidedTourProps {
  startTour: boolean;
  onClose: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ startTour, onClose }) => {
  const [run, setRun] = useState(startTour);

  useEffect(() => {
    setRun(startTour);
  }, [startTour]);

  const handleJoyrideCallback = (data: any) => {
    const { status, type } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      onClose();
    }
  };

  const steps: Step[] = [
    {
      target: '.collapse-button',
      content: 'Click here to expand the Major Setting section and change the number of semesters you would like to plan for.',
    },
    // {
    //   target: '.dropdown-select',
    //   content: 'Use these dropdowns to select your program and major etc.',
    // },
    {
      target: '.table',
      content: 'This is your study plan table. You can drag and drop courses here. Click on courses in the table to remove, update info or see details',
    },
    {
      target: '.course-query',
      content: 'Search course by academic year and course code here to add into the table.',
    },
    {
      target: '.add-button',
      content: 'Once successfully found a course, click here to add it into the column.',
    },
    {
      target: '.to-timetable-button',
      content: 'Click here to view a recommended timetable for this semester, according to the latest information.',
    },
    // {
    //   target: '.headerline',
    //   content: 'This is your study plan header.',
    // },
    {
      target: '.notificationsite',
      content: 'Notifications and warnings will appear here.',
    },
  ];

  return (
    <Joyride
      steps={steps}
      continuous
      showSkipButton
      showProgress
      run={run}
      callback={handleJoyrideCallback}
      disableScrolling={true}
      styles={{
        options: {
            zIndex: 10000,
            arrowColor: '#fff',
            backgroundColor: '#333',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            primaryColor: '#007bff',
            textColor: '#fff',
            width: 400,
          },
          buttonClose: {
            display: 'none',
          },
          buttonNext: {
            backgroundColor: '#007bff',
            color: '#fff',
          },
          buttonBack: {
            marginRight: 10,
            color: '#fff',
          },
          tooltip: {
            borderRadius: 4,
            textAlign: 'left',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipTitle: {
            margin: 0,
            padding: 0,
            color: '#007bff',
            fontSize: 18,
          },
          overlay: {
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
          },
      }}
    />
  );
};

export default GuidedTour;
