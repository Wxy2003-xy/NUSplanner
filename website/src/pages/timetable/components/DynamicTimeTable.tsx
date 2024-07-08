import React, { useState, useEffect, ChangeEvent } from "react";
import { GenericTimeSlot, Day, ClassTimeSlotType } from '../../../types/timetable';
import { useLocation } from 'react-router-dom';
import { getYear } from 'date-fns';
// Utility to map index to day names (assuming Monday start)
const dayNames: { [key: number]: Day } = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
}

const START_TIME = 8 * 60;  // 8:00 AM in minutes
const END_TIME = 18 * 60;   // 6:00 PM in minutes
const INTERVAL = 10; 

export function fetchTimeSlotInfo(acadYear: string, moduleCode: string, semesterArg: number): [ClassTimeSlotType | null, string] {
  const [courseTimeInfo, setTimeInfo] = useState<ClassTimeSlotType | null>(null);
  const [error, setError] = useState<string>('');
  if (semesterArg === 0) {
    throw new Error('Invalid semester data');
  }
  useEffect(() => {
    const nextYear = parseInt(acadYear, 10) + 1;
    const apiUrl = `https://api.nusmods.com/v2/${acadYear}-${nextYear}/modules/${moduleCode}.json`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const semesterSpecificInfo = data.semesterData.find((semester: any) => semester.semester === semesterArg);
        if (semesterSpecificInfo) {
          const slot: ClassTimeSlotType = {
            classNo: semesterSpecificInfo.classNo,
            startTime: semesterSpecificInfo.startTime,
            endTime: semesterSpecificInfo.endTime,
            weeks: semesterSpecificInfo.weeks,
            venue: semesterSpecificInfo.venue,
            day: semesterSpecificInfo.day,
            lessonType: semesterSpecificInfo.lessonType,
            title: 'lesson'
          };
          setTimeInfo(slot);
        } else {
          throw new Error('Semester information not found');
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setTimeInfo(null);
      });
  }, [acadYear, moduleCode, semesterArg]); // Dependencies for useEffect

  return [courseTimeInfo, error];
}


const DynamicTimeTable = () => {
  const location = useLocation();
  const { courseList, semester} = location.state || {courseList: [], semster: 0}
  const currentYear = new Date().getFullYear();
  const toArrange:ClassTimeSlotType[] = courseList.map(
    course => fetchTimeSlotInfo(JSON.stringify(currentYear), course, semester));


  const [numOfDays, setNumOfDays] = useState<number>(() => {
  const savedDays = localStorage.getItem('numOfDays');
    return savedDays ? parseInt(savedDays) : 5;
  });

  const handleSettingDays = (event: ChangeEvent<HTMLSelectElement>) => {
    const rows = parseInt(event.target.value);
    setNumOfDays(rows);
    localStorage.setItem('numOfDays', rows.toString());
  };
  return (
    <div>
      <select className="dropdown-select-days" value={numOfDays} onChange={handleSettingDays}>
        {[4, 5, 6, 7].map(num => (<option key={num} value={num}>{num + ' Days'}</option>))}
      </select>
      <h1>Timetable</h1>
      <h2>Semester: {semester}</h2>
      <ul>
        {courseList.map((course, index) => (
          <li key={index}>{course}</li>
        ))}
      </ul>
    </div>
  );
  
};

export default DynamicTimeTable;
