import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AlertTriangle } from 'react-feather';
import { ClassTimeSlotType, ClassTimeSlotTypeUnion, Day, DaysOfWeek } from '../../../types/timetable';
import './DynamicTimeTable.css'
import Timetable from "./table";
import GuidedTourTimetable from "./UserGuideTimetable";
import { evaluateTimetableFeasibility, TimetableSlot } from '../../../util/timetableFeasibility';

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

type TimeSlotCache = Record<string, ClassTimeSlotType[]> | TimetableSlot[];

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
        weeks: input.weeks ? JSON.parse(input.weeks) : undefined,
        lessonType: input.lessonType,
      };
      const existingSlots = Object.values(timeSlots).flat() as TimetableSlot[];
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
    DaysOfWeek.map(day => (
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

  const feasibility = useMemo(() => evaluateTimetableFeasibility(
    Object.values(timeSlots).flat() as TimetableSlot[],
    { days: selectedDays, earliestStartTime: minStartTime },
  ), [timeSlots, selectedDays, minStartTime]);
  const arranged = feasibility.arrangement;
  const navigate = useNavigate();
  const handleToMap = () => {
    if (!loading && arranged) {
      navigate('/map', { state: { timeSlots: arranged } });
    }
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
            <div><h2 id="timetable-preferences-title">Set your constraints</h2><p>Every required lesson must fit your allowed days and earliest start time.</p></div>
            <button className="tour-button" type="button" onClick={() => setShowTour(true)}>Quick tour</button>
          </div>
          <div className="timetable-preference-controls">
            <div className="select-day">
              <h3>Allowed days</h3>
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
        ) : feasibility.status === 'infeasible' ? (
          <div className="timetable-feasibility-warning" role="alert">
            <AlertTriangle size={22} aria-hidden="true" />
            <div>
              <h3>No feasible timetable arrangement is possible under the current constraints.</h3>
              <p>All required lessons cannot fit into a clash-free timetable with these settings.</p>
              <dl className="timetable-constraint-summary">
                <div><dt>Allowed days</dt><dd>{DaysOfWeek.filter(day => selectedDays.includes(day)).join(', ') || 'None selected'}</dd></div>
                <div><dt>Earliest class</dt><dd>{minStartTime || 'Any time'}</dd></div>
              </dl>
              {feasibility.blockedLessons.length > 0 ? (
                <p>No allowed class options remain for: <strong>{feasibility.blockedLessons.join(', ')}.</strong></p>
              ) : (
                <p>The remaining class options clash with one another.</p>
              )}
              <p className="timetable-warning-guidance">Allow more days, choose an earlier start time, or change your selected courses, then check again. The timetable updates automatically.</p>
            </div>
          </div>
        ) : arranged ? (
          <Timetable timeSlots={arranged} />
        ) : (
          <p className="no-valid-arrangement" role="status">No timetable data yet. Build a timetable from your study plan or add a custom time slot to check feasibility.</p>
        )}
        </div>
        <div className="timetable-actions">
          <button className="to-map-button" disabled={loading || feasibility.status !== 'feasible'} onClick={handleToMap}>View venues on map</button>
          <button className="clear-cache-button" onClick={clearCache}>Clear timetable data</button>
        </div>
      </div>
    );
};

export default DynamicTimeTable;
