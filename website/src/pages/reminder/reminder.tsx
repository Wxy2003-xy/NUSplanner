import React, { useEffect, useState, useRef } from 'react';
import './reminder.css';
import Layout from '../../components/Layout';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

const Reminder = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load reminders from localStorage or any other storage
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const handleReminderChange = (date: string, reminder: string) => {
    const newReminders = { ...reminders, [date]: reminder };
    setReminders(newReminders);
    // Save reminders to localStorage or any other storage
    localStorage.setItem('reminders', JSON.stringify(newReminders));
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="reminder-header remainder-row flex-middle">
        <div className="reminder-col reminder-col-start">
          <div className="reminder-icon reminder-icon-left" onClick={prevMonth}></div>
        </div>
        <div className="reminder-col reminder-col-center">
          <span className="reminder-date">{format(currentDate, dateFormat)}</span>
        </div>
        <div className="reminder-col reminder-col-end">
          <div className="reminder-icon reminder-icon-right" onClick={nextMonth}></div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days: JSX.Element[] = [];
    const dateFormat = "EEEE";
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="reminder-col reminder-col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="reminder-days reminder-row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows: JSX.Element[] = [];

    let days: JSX.Element[] = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const formattedFullDate = format(day, "yyyy-MM-dd");

        days.push(
          <div
            className={`reminder-col reminder-cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, new Date()) ? "selected" : ""
            }`}
            key={day.toString()}
          >
            <span className="reminder-number">{formattedDate}</span>
            <textarea
              className="reminder-textarea"
              value={reminders[formattedFullDate] || ""}
              onChange={(e) =>
                handleReminderChange(formattedFullDate, e.target.value)
              }
              placeholder=""
            />
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="reminder-row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <Layout>
      <div className="reminder-nav-right">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </Layout>
  );
};

export default Reminder;
