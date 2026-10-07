import React, { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Edit3, Shield } from 'react-feather';
import Layout from '../../components/Layout';
import './reminder.css';

type ReminderMap = { [key: string]: string };

const Reminder = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState<ReminderMap>({});

  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    if (!savedReminders) return;
    try {
      setReminders(JSON.parse(savedReminders));
    } catch {
      setReminders({});
    }
  }, []);

  const handleReminderChange = (date: string, reminder: string) => {
    const nextReminders = { ...reminders };
    if (reminder) nextReminders[date] = reminder;
    else delete nextReminders[date];
    setReminders(nextReminders);
    localStorage.setItem('reminders', JSON.stringify(nextReminders));
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(endOfMonth(monthStart));
    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const reminderCount = useMemo(() => (
    calendarDays.filter((day) => {
      const key = format(day, 'yyyy-MM-dd');
      return isSameMonth(day, currentDate) && Boolean(reminders[key]?.trim());
    }).length
  ), [calendarDays, currentDate, reminders]);

  return (
    <Layout>
      <div className="page-shell reminder-page">
        <div className="page-heading">
          <div>
            <p className="page-eyebrow">Your private calendar</p>
            <h1>Keep the semester in sight.</h1>
            <p className="page-description">Add a note to any day. Everything is stored only on this device and saved as you type.</p>
          </div>
          <div className="reminder-privacy-pill"><Shield size={15} /> Local & private</div>
        </div>

        <section className="reminder-calendar surface-card" aria-label={`Calendar for ${format(currentDate, 'MMMM yyyy')}`}>
          <div className="reminder-toolbar">
            <div className="reminder-month-copy">
              <span className="reminder-calendar-icon"><Calendar size={20} /></span>
              <div>
                <p>Monthly view</p>
                <h2>{format(currentDate, 'MMMM yyyy')}</h2>
              </div>
            </div>
            <div className="reminder-toolbar-actions">
              <span className="reminder-note-count">{reminderCount} {reminderCount === 1 ? 'note' : 'notes'}</span>
              <button className="secondary-button reminder-today-button" type="button" onClick={() => setCurrentDate(new Date())}>Today</button>
              <button className="icon-button" type="button" onClick={() => setCurrentDate(subMonths(currentDate, 1))} aria-label="Previous month">
                <ChevronLeft size={19} />
              </button>
              <button className="icon-button" type="button" onClick={() => setCurrentDate(addMonths(currentDate, 1))} aria-label="Next month">
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="reminder-grid" role="grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div className="reminder-weekday" role="columnheader" key={day}>{day}</div>
            ))}
            {calendarDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const note = reminders[dateKey] || '';
              const outsideMonth = !isSameMonth(day, currentDate);
              return (
                <div
                  className={`reminder-day${outsideMonth ? ' is-outside' : ''}${isToday(day) ? ' is-today' : ''}${note ? ' has-note' : ''}`}
                  role="gridcell"
                  key={dateKey}
                >
                  <div className="reminder-day-top">
                    <time dateTime={dateKey}>{format(day, 'd')}</time>
                    {note && <Edit3 size={12} aria-label="Has a reminder" />}
                  </div>
                  <textarea
                    value={note}
                    onChange={(event) => handleReminderChange(dateKey, event.target.value)}
                    placeholder={outsideMonth ? '' : 'Add note'}
                    aria-label={`Reminder for ${format(day, 'MMMM d, yyyy')}`}
                    disabled={outsideMonth}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Reminder;
