import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ClassTimeSlotType, ClassTimeSlotTypeUnion, Day } from '../../../types/timetable';
import { SlotKey} from '../../../util/timetableArrangement';
import './DynamicTimeTable.css'
import Timetable from "./table";
import GuidedTourTimetable from "./UserGuideTimetable";
import { TimeTable } from "../../../util/Timetable";
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
  const initialDays = JSON.parse(localStorage.getItem('selectedDays') || '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]');
  const initialStartTime = localStorage.getItem('minStartTime') || '10:00';

  const [selectedDays, setSelectedDays] = useState(initialDays);
  const [minStartTime, setMinStartTime] = useState(initialStartTime);

  const [customSlots, setCustomSlots] = useState<ClassTimeSlotTypeUnion[]>([]);
  const [newSlot, setNewSlot] = useState<ClassTimeSlotTypeUnion>({
    classNo: 'custom',
    startTime: [''],
    endTime: [''],
    day: ['Monday'],
    lessonType: '',
    title: '',
    weeks: [],
  });
  const handleCustomSlotChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewSlot(prevSlot => ({
      ...prevSlot,
      [name]: [value]
    }));
  };
  const handleAddCustomSlot = () => {

  };

  const [showTour, setShowTour] = useState(() => {
    const storedShowTour = localStorage.getItem('showTourState');
    return storedShowTour === null ? true : storedShowTour === 'true';
  });
  const [loading, setLoading] = useState(false);

  const handleTourClose = () => {
    setShowTour(true);
    localStorage.setItem('showTourState', 'true');
  };

  useEffect(() => {
    localStorage.setItem('selectedDays', JSON.stringify(selectedDays));
    localStorage.setItem('minStartTime', minStartTime);
  }, [selectedDays, minStartTime]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
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
      setLoading(false); 
    };

    if (courseList.length > 0 && (Object.keys(timeSlots).length === 0 || window.confirm("New course list detected. Do you want to refresh the cached data?"))) {
      fetchData();
    }
  }, [acadYear, courseList, semester]); 

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
      const lessonType = slot.lessonType || 'undefined';  
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
    lessonTypeCountPerCourse.forEach((count, course) => {
    });
    return lessonTypeCountPerCourse;
  };

  const getKey = (slot: ClassTimeSlotTypeUnion): SlotKey => {
    const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
    return key;
  }

  const getPartialKeyUnion = (Slot: ClassTimeSlotTypeUnion): SlotKey => {
    return (Slot.title as string) + (Slot.lessonType as string) + Slot.classNo;
  }
  const transformSlots = (slots: ClassTimeSlotType[]): ClassTimeSlotTypeUnion[] => {
    const grouped = new Map<string, ClassTimeSlotTypeUnion>();
    slots.forEach(slot => {
        const partialKey = `${slot.title}${slot.lessonType}${slot.classNo}`;
        const existing = grouped.get(partialKey);
        if (existing) {
            existing.startTime.push(slot.startTime as string);
            existing.endTime.push(slot.endTime as string);
            existing.day.push(slot.day as Day);
        } else {
            grouped.set(partialKey, {
                classNo: slot.classNo,
                title: slot.title,
                lessonType: slot.lessonType,
                startTime: [slot.startTime as string],
                endTime: [slot.endTime as string],
                weeks: slot.weeks,
                venue: slot.venue,
                day: [slot.day as Day],
            });
        }
    });
    return Array.from(grouped.values());
  }

  const filterByDays = (days: string[], slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
    const groups = slots.reduce((acc, slot) => {
      const key = getPartialKeyUnion(slot);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(slot);
      return acc;
    }, {} as Record<string, ClassTimeSlotTypeUnion[]>);
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
    const filteredGroups = Object.values(groups).filter(group =>
          group.every(slot => slot.startTime.some(time => timeToMinutes(time) >= startTimeInMinutes)));
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
  const filterStartTime = filterByStartTime(minStartTime, filterDays);
  const timeTable = new TimeTable();
  const partitionSlots = (timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[][] => {
    const courses = new Map<string, ClassTimeSlotTypeUnion[]>();
    timeslots.forEach(slot => {
        const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
        if (!courses.has(title)) {
            courses.set(title, []);
        }
        courses.get(title)?.push(slot);
    });
    const partitions: ClassTimeSlotTypeUnion[][] = Array.from(courses.values());
    return partitions;
  }
  const partitions = partitionSlots(filterStartTime);
  const arranged = timeTable.findValidArrangement(partitions);
  const navigate = useNavigate();
  const handleToMap = () => {
    navigate('/map', { state: { timeSlots: arranged } });
  };
    return (
      <div> 
        {showTour && <GuidedTourTimetable startTour={showTour} onClose={handleTourClose} />}
        <div className="select-day">
          <h3>Select Days</h3>
          {renderDayCheckboxes()}
        </div>
        <div className="select-time">
          <h3>No earlier than:</h3>
          <input type="time" value={minStartTime} onChange={handleStartTimeChange} />
        </div>
        {/* <div className="custom-slot-adder">
          <h3>Add Custom Slot</h3>
          <form className="custom-form"onSubmit={(e) => { e.preventDefault(); handleAddCustomSlot(); }}>
            <label>
              Title:
              <input type="text" name="title" value={newSlot.title} onChange={handleCustomSlotChange} required />
            </label>
            <label>
              Lesson Type:
              <input type="text" name="lessonType" value={newSlot.lessonType} onChange={handleCustomSlotChange} required />
            </label>
            <label>
              Start Time:
              <input type="time" name="startTime" value={newSlot.startTime[0]} onChange={handleCustomSlotChange} required />
            </label>
            <label>
              End Time:
              <input type="time" name="endTime" value={newSlot.endTime[0]} onChange={handleCustomSlotChange} required />
            </label>
            <label>
              Day:
              <select name="day" value={newSlot.day[0]} onChange={handleCustomSlotChange} required>
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="add-slot-button">Add Slot</button>
          </form>
        </div> */}
        <div className="timetable-container">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <div>
            {arranged ? 
            <Timetable timeSlots={arranged}></Timetable> : <p>No valid arrangement found.</p>} 
          </div>
        )}
      </div>
        <button className="to-map-button" onClick={() => handleToMap()}>View Map</button>
      </div>
    );
};

export default DynamicTimeTable;
