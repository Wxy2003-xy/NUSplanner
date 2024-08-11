import React, { useState, useEffect } from 'react';
import Joyride, { Step } from 'react-joyride';

interface GuidedTourProps {
  startTour: boolean;
  onClose: () => void;
}

const GuidedTourTimetable: React.FC<GuidedTourProps> = ({ startTour, onClose }) => {
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
      target: '.select-day',
      content: 'Deselect days you want to leave unoccupied.',
    },
    {
      target: '.select-time',
      content: 'Set a time such that no slots earlier than it will be arranged.',
    },
    // {
    //   target: '.custom-slot-adder',
    //   content: 'Add custom agenda to the timetable',
    // },
    // {
    //   target: '.timetablecontainer',
    //   content: 'Auto generated timetable based on criteria selected. Note that some slot may not be arranged if there exist no possible arrangement with given filters. Try relax them a little.',
    // },
    {
      target: '.to-map-button',
      content: 'Click to see locations of the classes in timetable',
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

export default GuidedTourTimetable;
