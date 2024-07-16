import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { ClassTimeSlotType } from '../../../types/timetable';
import {arrange, SlotKey, SlotType} from '../../../util/timetableArrangement';
import './DynamicTimeTable.css'
import { size } from 'lodash';
import { overlap } from "../../../util/timetableArrangement";
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const fetchTimeSlotInfo = async (acadYear:string, moduleCode:string, semester:number) => {
  const apiUrl = `https://api.nusmods.com/v2/${acadYear}/modules/${moduleCode}.json`;
  try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const semesterSpecificInfo = data.semesterData.find(semesterData => semesterData.semester === semester);
      if (!semesterSpecificInfo) {
          throw new Error('Semester information not found');
      }
      return semesterSpecificInfo.timetable.map(slot => ({
          classNo: slot.classNo,
          startTime: slot.startTime,
          endTime: slot.endTime,
          weeks: slot.weeks,
          venue: slot.venue,
          day: slot.day,
          lessonType: slot.lessonType,
          title: moduleCode
      }));
  } catch (err) {
      console.error('Error fetching data:', err);
      throw err;
  }
};

const DynamicTimeTable = () => {
  const location = useLocation();
  const { courseList, semester } = location.state || { courseList: [], semester: 1 };
  const currentYear = new Date().getFullYear();
  const acadYear = `${currentYear}-${currentYear + 1}`;

  const [timeSlots, setTimeSlots] = useState(() => {
    const data = localStorage.getItem('cachedTimeSlots');
    return data ? JSON.parse(data) : {};
  });
  const [errors, setErrors] = useState({});
  const [selectedDays, setSelectedDays] = useState(["Monday","Tuesday","Wednesday","Thursday", "Friday"]);
  const [minStartTime, setMinStartTime] = useState('10:00'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slotsPromises = courseList.map(course => fetchTimeSlotInfo(acadYear, course, semester));
        const slots = await Promise.all(slotsPromises);
        const newSlots = slots.reduce((acc, slot, idx) => ({
          ...acc,
          [courseList[idx]]: slot
        }), {});
        setTimeSlots(newSlots);
        localStorage.setItem('cachedTimeSlots', JSON.stringify(newSlots));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (courseList.length > 0 && (Object.keys(timeSlots).length === 0 || window.confirm("New course list detected. Do you want to refresh the cached data?"))) {
      fetchData();
    }
  }, [acadYear, courseList, semester]); // Removed timeSlots from dependencies

  const saveTimeSlots = () => {
    console.log(JSON.stringify(arranged))
    localStorage.setItem('cachedTimeSlots', JSON.stringify(arranged));
    alert('Time slots saved successfully!');
  };

  const countLessonTypesPerCourse = (slots: ClassTimeSlotType[]): Map<string, number> => {
    const courseLessonTypeCounts = new Map<string, Map<string, number>>();
    slots.forEach(slot => {
        const course = slot.title;
        const lessonType = slot.lessonType || 'undefined';  // Treat undefined lessonType as a literal 'undefined'
        if (!courseLessonTypeCounts.has(course)) {
            courseLessonTypeCounts.set(course, new Map<string, number>());
        }
        const lessonCounts = courseLessonTypeCounts.get(course);
        if (lessonCounts) {
            if (!lessonCounts.has(lessonType)) {
                lessonCounts.set(lessonType, 1);
            } else {
                lessonCounts.set(lessonType, lessonCounts.get(lessonType)as number + 1);
            }
        }
    });
    const lessonTypeCountPerCourse = new Map<string, number>();
    courseLessonTypeCounts.forEach((types, course) => {
        lessonTypeCountPerCourse.set(course, types.size);
    });
    console.log("Lesson type counts per course:");
    lessonTypeCountPerCourse.forEach((count, course) => {
        console.log(`Course: ${course}, Count of Lesson Types: ${count}`);
    });
    return lessonTypeCountPerCourse;
};

  function areMapsEqual(map1, map2) {
    if (map1.size !== map2.size) {
        return false;
    }
    for (let [key, value] of map1) {
        if (!map2.has(key) || map2.get(key) !== value) {
            return false;
        }
    }
    return true;
  }
  const getKey = (Slot: ClassTimeSlotType): SlotKey => {
    return Slot.title+Slot.lessonType+Slot.classNo+Slot.day;
  }
  const filterByDays = (days: string[], slots: ClassTimeSlotType[]): ClassTimeSlotType[] => {
    // Group slots by key
    const groups = slots.reduce((acc, slot) => {
        const key = getKey(slot);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(slot);
        return acc;
    }, {} as Record<string, ClassTimeSlotType[]>);

    const filteredGroups = Object.values(groups).filter(group => 
        group.every(slot => slot.day && days.includes(slot.day))
    );

    return filteredGroups.flat();
};
const filterByStartTime = (startTime: string, slots: ClassTimeSlotType[]): ClassTimeSlotType[] => {
  const startTimeInMinutes = timeToMinutes(startTime);
  const groups = slots.reduce((acc, slot) => {
      const key = getKey(slot);
      if (!acc[key]) {
          acc[key] = [];
      }
      acc[key].push(slot);
      return acc;
  }, {} as Record<string, ClassTimeSlotType[]>);

  // Filter the groups based on the condition
  const filteredGroups = Object.values(groups).filter(group =>
      group.every(slot => slot.startTime && timeToMinutes(slot.startTime) >= startTimeInMinutes)
  );

  // Flattening the filtered groups back into a single array
  return filteredGroups.flat();
};

const timeToMinutes = (time: string): number => {
  const formattedTime = time.length === 4 ? `${time.slice(0, 2)}:${time.slice(2, 4)}` : time;
  const parts = formattedTime.split(':');
  if (parts.length !== 2) {
      console.error('Invalid time format:', time);
      return 0; 
  }
  const [hours, minutes] = parts.map(Number);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
};

const overlap = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
  if (slot1.day !== slot2.day) {
      return false;
  }
  if (!slot1.startTime || !slot1.endTime || !slot2.startTime || !slot2.endTime) {
      return false;
  }
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);
  return !(end1 <= start2 || start1 >= end2);
};

  const slotsArray = Object.values(timeSlots).flat() as ClassTimeSlotType[];
  // console.log(JSON.stringify(slotsArray))
  const filterDays = filterByDays(selectedDays, slotsArray);
  // console.log(JSON.stringify(filterDays))
  const filterStartTime = filterByStartTime(minStartTime, filterDays);
  // console.log('filtered slots info: '+ JSON.stringify(filterStartTime))
  const arranged = arrange(filterStartTime)

  return (
    <div> 
      <h1>Timetable</h1>
      <h2>Semester: {semester}</h2>
      
      
      {arranged ? (
      arranged.map(slot => (
        <div key={getKey(slot)}>
          <p>{`${slot.title} classNo: ${slot.lessonType} ${slot.classNo} on ${slot.day} from ${slot.startTime} to ${slot.endTime}`}</p>
        </div>
      ))
    ) : <p>No valid arrangement found.</p>}
    {areMapsEqual(countLessonTypesPerCourse(slotsArray), countLessonTypesPerCourse(filterStartTime))?<p></p>:<p>there are clashing slots</p>}
      <button onClick={saveTimeSlots}>Save Timetable</button>
    </div>
  );
};

export default DynamicTimeTable;
