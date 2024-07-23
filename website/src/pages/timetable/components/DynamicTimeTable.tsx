import React, { useState, useEffect, ChangeEvent } from "react";
import { GenericTimeSlot, Day, ClassTimeSlotType } from '../../../types/timetable';
import { useLocation } from 'react-router-dom';
<<<<<<< Updated upstream
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
=======
import { ClassTimeSlotType, ClassTimeSlotTypeUnion, CleanClassTimeSlot} from '../../../types/timetable';
import { DFSUnionArrange, SlotKey, SlotType, findMaxCliques} from '../../../util/timetableArrangement';
import './DynamicTimeTable.css'
import { size } from 'lodash';
import { overlap } from "../../../util/timetableArrangement";
import Timetable from "./table";
import { arrange } from '../../../util/timetableArrange';
import { backtrackingArrange, slotPreprocessing, transformAndMergeSlots } from "../../../util/arrangeWithUnionedSlots";
import UnderConstruction from "../../../components/UnderConstruction";
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
>>>>>>> Stashed changes

const START_TIME = 8 * 60;  // 8:00 AM in minutes
const END_TIME = 18 * 60;   // 6:00 PM in minutes
const INTERVAL = 10; 

function fetchTimeSlotInfo(acadYear: string, moduleCode: string, semesterArg: number): [ClassTimeSlotType | null, string] {
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
            title: moduleCode
          };
          setTimeInfo(slot);
        } else {
          const slot: ClassTimeSlotType = {
            classNo: undefined,
            startTime: undefined,
            endTime: undefined,
            weeks: undefined,
            venue: undefined,
            day: undefined,
            lessonType: undefined,
            title: moduleCode
          };
          // setTimeInfo(slot);
          console.log(moduleCode + 'has no time slot info')
          throw new Error('Semester information  not found');
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setTimeInfo(null);
      });
  }, [acadYear, moduleCode, semesterArg]); // Dependencies for useEffect
  console.log(courseTimeInfo);
  
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

  useEffect(() => {
    const existingCourses = localStorage.getItem('courseList');
    console.log();
    
    if (!existingCourses || existingCourses === "[]") {
      console.log("Setting new course list in local storage.");
      localStorage.setItem('courseList', JSON.stringify(courseList));
    } else if (JSON.stringify(courseList) !== existingCourses) {
      console.log("Clearing old course list and setting new one.");
      localStorage.removeItem('courseList'); // Clear existing
      localStorage.setItem('courseList', JSON.stringify(courseList)); // Set new
    }
<<<<<<< Updated upstream
  }, [courseList]);
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
=======
  }, [acadYear, courseList, semester]); // Removed timeSlots from dependencies

  const saveTimeSlots = () => {
    console.log(JSON.stringify(arranged))
    localStorage.setItem('cachedTimeSlots', JSON.stringify(arranged));
    alert('Time slots saved successfully!');
  };

  const handleDayChange = (day) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
  };

  const renderDayCheckboxes = () => (
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
      <label key={day}>
        <input
          type="checkbox"
          checked={selectedDays.includes(day)}
          onChange={() => handleDayChange(day)}
        /> {day}
      </label>
    ))
  );

  const handleStartTimeChange = (event) => {
    setMinStartTime(event.target.value);
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
    // console.log("Lesson type counts per course:");
    lessonTypeCountPerCourse.forEach((count, course) => {
        // console.log(`Course: ${course}, Count of Lesson Types: ${count}`);
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
  const getKeySlot = (slot: ClassTimeSlotType): SlotKey => {
    const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
    // console.log(key); // Debugging: Log out the keys to check for duplicates
    return key;
}

const getKey = (slot: CleanClassTimeSlot): SlotKey => {
  const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
  // console.log(key); // Debugging: Log out the keys to check for duplicates
  return key;
}

  const getPartialKey = (Slot: ClassTimeSlotType): SlotKey => {
    return Slot.title+Slot.lessonType+Slot.classNo;
  }
  const getPartialKeyUnion = (Slot: ClassTimeSlotTypeUnion): SlotKey => {
    return Slot.title+Slot.lessonType+Slot.classNo;
  }
  function transformSlots(slots: ClassTimeSlotType[]): ClassTimeSlotTypeUnion[] {
    const grouped = new Map<string, ClassTimeSlotTypeUnion>();

    slots.forEach(slot => {
        const partialKey = `${slot.title}${slot.lessonType}${slot.classNo}`;
        const existing = grouped.get(partialKey);
        if (existing) {
            existing.startTime.push(slot.startTime as string);
            existing.endTime.push(slot.endTime as string);
            existing.day.push(slot.day as string);
        } else {
            grouped.set(partialKey, {
                classNo: slot.classNo,
                title: slot.title,
                lessonType: slot.lessonType,
                startTime: [slot.startTime as string],
                endTime: [slot.endTime as string],
                weeks: slot.weeks,
                venue: slot.venue,
                day: [slot.day as string],
            });
        }
    });
    return Array.from(grouped.values());
}

const filterByDays = (days: string[], slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
  // Assuming getPartialKey function works with ClassTimeSlotTypeUnion or it is suitably modified
  const groups = slots.reduce((acc, slot) => {
      const key = getPartialKeyUnion(slot);
      if (!acc[key]) {
          acc[key] = [];
      }
      acc[key].push(slot);
      return acc;
  }, {} as Record<string, ClassTimeSlotTypeUnion[]>);

  // Filter groups where all slots have at least one day that matches the selected days
  const filteredGroups = Object.values(groups).filter(group =>
      group.every(slot => slot.day.some(day => days.includes(day)))
  );

  return filteredGroups.flat();
};
const filterByStartTime = (startTime: string, slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
  const startTimeInMinutes = timeToMinutes(startTime);
  const groups = slots.reduce((acc, slot) => {
      const key = getPartialKeyUnion(slot);
      if (!acc[key]) {
          acc[key] = [];
      }
      acc[key].push(slot);
      return acc;
  }, {} as Record<string, ClassTimeSlotTypeUnion[]>);

  // Filter the groups based on the condition that all startTimes in the group are after the given startTime
  const filteredGroups = Object.values(groups).filter(group =>
      group.every(slot => slot.startTime.some(time => timeToMinutes(time) >= startTimeInMinutes))
  );

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




  const slotsArray = Object.values(timeSlots).flat() as ClassTimeSlotType[];
  console.log(JSON.stringify(slotsArray))
  const slotsArrayUnioned = transformSlots(slotsArray);
  console.log(JSON.stringify(slotsArrayUnioned))

  const filterDays = filterByDays(selectedDays, slotsArrayUnioned);
  // console.log(JSON.stringify(filterDays))
  const filterStartTime = filterByStartTime(minStartTime, filterDays);
  // console.log('filtered slots info: '+ JSON.stringify(filterStartTime))
  // const arranged = arrange(filterStartTime)
  const arranged = transformAndMergeSlots(filterDays)
  const navigate = useNavigate();

  const handleToMap = () => {
    navigate('/map', { state: { timeSlots: arranged } });
  };
  return (
    <div> 
      <UnderConstruction/>
      {/* <h1>Timetable</h1> */}
>>>>>>> Stashed changes
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
