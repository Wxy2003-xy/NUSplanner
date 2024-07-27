import { useState, useEffect } from 'react';
import { ClassTimeSlotType } from '../../../types/timetable';
function useFetchTimeSlotInfo(acadYear: string, moduleCode: string, semesterArg: number): [ClassTimeSlotType[] | null, string] {
  const [courseTimeInfo, setTimeInfo] = useState<ClassTimeSlotType[] | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (semesterArg === 0) {
      setError('Invalid semester data');
      return;
    }

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
        if (!semesterSpecificInfo) {
          throw new Error('Semester information not found');
        }
        const slots = semesterSpecificInfo.timetable.map((slot: any) => ({
          classNo: slot.classNo,
          startTime: slot.startTime,
          endTime: slot.endTime,
          weeks: slot.weeks,
          venue: slot.venue,
          day: slot.day,
          lessonType: slot.lessonType,
          title: moduleCode
        }));
        setTimeInfo(slots);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setTimeInfo(null);
      });
  }, [acadYear, moduleCode, semesterArg]);

  return [courseTimeInfo, error];
}

export default useFetchTimeSlotInfo;
