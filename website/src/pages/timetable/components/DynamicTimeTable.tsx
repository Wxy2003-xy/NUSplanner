import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ClassTimeSlotType, ClassTimeSlotTypeUnion, Day } from '../../../types/timetable';
import './DynamicTimeTable.css'
import Timetable from "./table";
import GuidedTourTimetable from "./UserGuideTimetable";
import { TimeTable } from "../../../util/Timetable";

interface NusModsTimetableSlot {
  classNo: string;
  startTime: string;
  endTime: string;
  weeks: ClassTimeSlotType['weeks'];
  venue: string;
  day: Day;
  lessonType: string;
}

interface NusModsModuleResponse {
  semesterData: Array<{
    semester: number;
    timetable: NusModsTimetableSlot[];
  }>;
}

type TimeSlotCache = Record<string, ClassTimeSlotType[]> | ClassTimeSlotTypeUnion[];

const fetchTimeSlotInfo = async (acadYear:string, moduleCode:string, semester:number) => {
  const apiUrl = `https://api.nusmods.com/v2/${acadYear}/modules/${moduleCode}.json`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = (await response.json()) as NusModsModuleResponse;
  const semesterSpecificInfo = data.semesterData.find(({ semester: availableSemester }) => availableSemester === semester);
  if (!semesterSpecificInfo) {
    throw new Error('Semester information not found');
  }
  return semesterSpecificInfo.timetable.map((slot): ClassTimeSlotType => ({
    classNo: slot.classNo,
    startTime: slot.startTime,
    endTime: slot.endTime,
    weeks: slot.weeks,
    venue: slot.venue,
    day: slot.day,
    lessonType: slot.lessonType,
    title: moduleCode
  }));
};

const DynamicTimeTable = () => {
  const location = useLocation();
  const courseList = useMemo<string[]>(() => (location.state?.courseList ?? []) as string[], [location.state]);
  const semester = (location.state?.semester ?? 1) as number;
  const today = new Date();
  const academicStartYear = today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1;
  const acadYear = `${academicStartYear}-${academicStartYear + 1}`;

  const [timeSlots, setTimeSlots] = useState<TimeSlotCache>(() => {
    const data = localStorage.getItem('cachedTimeSlots');
    return data ? JSON.parse(data) as TimeSlotCache : [];
  });
  const initialDays = JSON.parse(localStorage.getItem('selectedDays') || '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]') as Day[];
  const initialStartTime = localStorage.getItem('minStartTime') || '08:00';

  const [selectedDays, setSelectedDays] = useState<Day[]>(initialDays);
  const [minStartTime, setMinStartTime] = useState(initialStartTime);

  const [input, setInput] = useState({
    title: '',
    day: '',
    startTime: '',
    endTime: '',
    classNo: '',
    venue: '',
    weeks: '',
    lessonType: '',
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setInput(prevInput => ({
      ...prevInput,
      [name]: value,
    }));
  };
  const handleAddSlot = () => {
    try {
      const newSlot: ClassTimeSlotTypeUnion = {
        title: input.title,
        day: [input.day as Day],
        startTime: [input.startTime],
        endTime: [input.endTime],
        classNo: input.classNo,
        venue: input.venue,
        weeks: input.weeks ? JSON.parse(input.weeks) : [],
        lessonType: input.lessonType,
      };
      const existingSlots = Object.values(timeSlots).flat() as ClassTimeSlotTypeUnion[];
      const nextSlots = [...existingSlots, newSlot];
      setTimeSlots(nextSlots);
      localStorage.setItem('cachedTimeSlots', JSON.stringify(nextSlots));
      setInput({ title: '', day: '', startTime: '', endTime: '', classNo: '', venue: '', weeks: '', lessonType: '' });
    } catch {
      alert('Weeks must be a valid list, for example [1,2,3].');
    }
  };

  const [showTour, setShowTour] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleTourClose = () => {
    setShowTour(false);
    localStorage.setItem('showTourState', 'false');
  };

  useEffect(() => {
    localStorage.setItem('selectedDays', JSON.stringify(selectedDays));
    localStorage.setItem('minStartTime', minStartTime);
  }, [selectedDays, minStartTime]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const slotsPromises = courseList
        .map(course => fetchTimeSlotInfo(acadYear, course, semester));
          const slots = await Promise.all(slotsPromises);
        const newSlots = slots.reduce((acc, slot, idx) => ({
          ...acc,
          [courseList[idx]]: slot
        }), {});
        setTimeSlots(newSlots);
        localStorage.setItem('cachedTimeSlots', JSON.stringify(newSlots));
      } catch {
        setFetchError('Course timings could not be loaded from NUSMods. Your saved timetable is still available.');
      } finally {
        setLoading(false);
      }
    };

    const cachedData = localStorage.getItem('cachedTimeSlots');
    if (courseList.length > 0 && (!cachedData
    || window.confirm("New course list detected. Do you want to refresh the cached data?"))) {
      fetchData();
    }
  }, [acadYear, courseList, semester]); 

  const handleDayChange = (day: Day) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
  };

  const renderDayCheckboxes = () => (
    (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as Day[]).map(day => (
      <label key={day}>
        <input
          type="checkbox"
          checked={selectedDays.includes(day)}
          onChange={() => handleDayChange(day)}
        /> {day}
      </label>
    ))
  );

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinStartTime(event.target.value);
  };

  const countLessonTypesPerCourse = (slots: Array<ClassTimeSlotType | ClassTimeSlotTypeUnion>): Map<string, number> => {
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
    return lessonTypeCountPerCourse;
  };
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

  // const filterByDays = (days: string[], slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
  //   const groups = slots.reduce((acc, slot) => {
  //     const key = getPartialKeyUnion(slot);
  //     if (!acc[key]) {
  //       acc[key] = [];
  //     }
  //     acc[key].push(slot);
  //     return acc;
  //   }, {} as Record<string, ClassTimeSlotTypeUnion[]>);
  //   const filteredGroups = Object.values(groups).filter(group =>
  //       group.every(slot => slot.day.some(day => days.includes(day)))
  //   );
  //   return filteredGroups.flat();
  // };
  const filterByDays = (days: Day[], slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
    const lessonTypeCountBefore = countLessonTypesPerCourse(slots);
  
    const groups = slots.reduce((acc, slot) => {
      const key = `${slot.title}${slot.lessonType}${slot.classNo}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(slot);
      return acc;
    }, {} as Record<string, ClassTimeSlotTypeUnion[]>);
  
    // Perform the filtering
    const filteredGroups = Object.values(groups).filter(group =>
      group.every(slot => slot.day.some(day => days.includes(day)))
    );
  
    const filteredSlots = filteredGroups.flat();
    const lessonTypeCountAfter = countLessonTypesPerCourse(filteredSlots);
  
    // Identify slots that should be kept to avoid reducing lesson types
    const slotsToKeep: ClassTimeSlotTypeUnion[] = [];
    for (const [course, beforeCount] of lessonTypeCountBefore) {
      const afterCount = lessonTypeCountAfter.get(course) || 0;
      if (beforeCount !== afterCount) {
        // Identify the slots that belong to the affected course
        const affectedSlots = slots.filter(slot => slot.title === course);
        slotsToKeep.push(...affectedSlots);
      }
    }
  
    // Merge the filtered slots with those that must be kept
    const finalSlots = [...filteredSlots, ...slotsToKeep];
  
    // Remove any duplicate slots that might have been added twice
    const uniqueSlots = Array.from(new Set(finalSlots.map(slot => `${slot.title}${slot.lessonType}${slot.classNo}${slot.startTime}${slot.day}`)))
      .map(key => finalSlots.find(slot => `${slot.title}${slot.lessonType}${slot.classNo}${slot.startTime}${slot.day}` === key))
      .filter((slot): slot is ClassTimeSlotTypeUnion => slot !== undefined);
  
    return uniqueSlots;
  };
  
  
  // const filterByStartTime = (startTime: string, slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
  //   const startTimeInMinutes = timeToMinutes(startTime);
  //   const groups = slots.reduce((acc, slot) => {
  //     const key = getPartialKeyUnion(slot);
  //     if (!acc[key]) {
  //         acc[key] = [];
  //     }
  //     acc[key].push(slot);
  //     return acc;
  //   }, {} as Record<string, ClassTimeSlotTypeUnion[]>);
  //   const filteredGroups = Object.values(groups).filter(group =>
  //         group.every(slot => slot.startTime.some(time => timeToMinutes(time) >= startTimeInMinutes)));
  //   return filteredGroups.flat();
  // };
  const filterByStartTime = (startTime: string, slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
    const lessonTypeCountBefore = countLessonTypesPerCourse(slots);
    const startTimeInMinutes = timeToMinutes(startTime);
  
    const groups = slots.reduce((acc, slot) => {
      const key = `${slot.title}${slot.lessonType}${slot.classNo}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(slot);
      return acc;
    }, {} as Record<string, ClassTimeSlotTypeUnion[]>);
  
    // Perform the filtering
    const filteredGroups = Object.values(groups).filter(group =>
      group.every(slot => slot.startTime.some(time => timeToMinutes(time) >= startTimeInMinutes))
    );
  
    const filteredSlots = filteredGroups.flat();
    const lessonTypeCountAfter = countLessonTypesPerCourse(filteredSlots);
  
    // Identify slots that should be kept to avoid reducing lesson types
    const slotsToKeep: ClassTimeSlotTypeUnion[] = [];
    for (const [course, beforeCount] of lessonTypeCountBefore) {
      const afterCount = lessonTypeCountAfter.get(course) || 0;
      if (beforeCount !== afterCount) {
        // Identify the slots that belong to the affected course
        const affectedSlots = slots.filter(slot => slot.title === course);
        slotsToKeep.push(...affectedSlots);
      }
    }
  
    // Merge the filtered slots with those that must be kept
    const finalSlots = [...filteredSlots, ...slotsToKeep];
  
    // Remove any duplicate slots that might have been added twice
    const uniqueSlots = Array.from(new Set(finalSlots.map(slot => `${slot.title}${slot.lessonType}${slot.classNo}${slot.startTime}${slot.day}`)))
      .map(key => finalSlots.find(slot => `${slot.title}${slot.lessonType}${slot.classNo}${slot.startTime}${slot.day}` === key))
      .filter((slot): slot is ClassTimeSlotTypeUnion => slot !== undefined);
  
    return uniqueSlots;
  };
  
  
  
  const timeToMinutes = (time: string): number => {
    const formattedTime = time.length === 4 ? `${time.slice(0, 2)}:${time.slice(2, 4)}` : time;
    const parts = formattedTime.split(':');
    if (parts.length !== 2) {
        return 0; 
    }
    const [hours, minutes] = parts.map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  };

  const slotsArray = Object.values(timeSlots).flat() as ClassTimeSlotType[];
  const slotsArrayUnioned = transformSlots(slotsArray);
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

  const clearCache = () => {
    localStorage.removeItem('cachedTimeSlots');
    localStorage.removeItem('selectedDays');
    localStorage.removeItem('minStartTime');
    localStorage.removeItem('showTourState');
    setTimeSlots({});
    setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    setMinStartTime('10:00');
    alert('Cache cleared successfully!');
  };
    return (
      <div className="timetable-builder">
        {showTour && <GuidedTourTimetable startTour={showTour} onClose={handleTourClose} />}
        <section className="timetable-preferences" aria-labelledby="timetable-preferences-title">
          <div className="timetable-preference-heading">
            <span>01</span>
            <div><h2 id="timetable-preferences-title">Set your preferences</h2><p>We will keep every required lesson type while finding the best fit.</p></div>
            <button className="tour-button" type="button" onClick={() => setShowTour(true)}>Quick tour</button>
          </div>
          <div className="timetable-preference-controls">
            <div className="select-day">
              <h3>Preferred days</h3>
              <div className="day-chip-list">{renderDayCheckboxes()}</div>
            </div>
            <label className="select-time">
              <span><strong>Earliest class</strong><small>Avoid sessions before this time</small></span>
              <input type="time" value={minStartTime} onChange={handleStartTimeChange} />
            </label>
          </div>
        </section>

        <details className="custom-slot-adder">
          <summary>Add a custom time slot <span>For commitments not found in NUSMods</span></summary>
          <div className="timetable-form">
            <input type="text" name="title" placeholder="Course title" aria-label="Course title" value={input.title} onChange={handleInputChange} />
            <input type="text" name="day" placeholder="Day (Monday)" aria-label="Day" value={input.day} onChange={handleInputChange} />
            <input type="text" name="startTime" placeholder="Start (1000)" aria-label="Start time" value={input.startTime} onChange={handleInputChange} />
            <input type="text" name="endTime" placeholder="End (1100)" aria-label="End time" value={input.endTime} onChange={handleInputChange} />
            <input type="text" name="classNo" placeholder="Class number" aria-label="Class number" value={input.classNo} onChange={handleInputChange} />
            <input type="text" name="venue" placeholder="Venue" aria-label="Venue" value={input.venue} onChange={handleInputChange} />
            <input type="text" name="weeks" placeholder="Weeks [1,2,3]" aria-label="Weeks" value={input.weeks} onChange={handleInputChange} />
            <input type="text" name="lessonType" placeholder="Lesson type" aria-label="Lesson type" value={input.lessonType} onChange={handleInputChange} />
            <button className="add-slot-button" type="button" onClick={handleAddSlot}>Add slot</button>
          </div>
        </details>

        <div className="timetable-result">
        {fetchError && <p className="no-valid-arrangement" role="alert">{fetchError}</p>}
        {loading ? (
          <div className="loading-indicator"><span /> Finding a timetable that fits…</div>
        ) : (
          <div>
            {arranged ? 
            <Timetable timeSlots={arranged}></Timetable> : <p className="no-valid-arrangement">No valid arrangement found.</p>} 
          </div>
        )}
        </div>
        <div className="timetable-actions">
          <button className="to-map-button" onClick={() => handleToMap()}>View venues on map</button>
          <button className="clear-cache-button" onClick={clearCache}>Clear timetable data</button>
        </div>
      </div>
    );
};

export default DynamicTimeTable;
