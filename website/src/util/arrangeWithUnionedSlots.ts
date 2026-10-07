import {
  ClassNo,
  ClassTimeSlotType,
  CleanClassTimeSlot,
  Day,
  EndTime,
  NumericWeeks,
  StartTime,
  Venue,
  Weeks,
} from '../types/timetable';

type SlotInput = Omit<ClassTimeSlotType, 'day'> & { day?: Day | string };

const venueName = (venue: Venue | string | undefined): string => {
  if (typeof venue === 'string') return venue;
  return venue?.roomName || '';
};

const firstPass = (slots: SlotInput[]): CleanClassTimeSlot[] => {
  const grouped = new Map<string, CleanClassTimeSlot>();

  slots.forEach((slot) => {
    const key = `${slot.title}|${slot.lessonType || ''}|${slot.classNo || ''}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.startTime.push(slot.startTime as StartTime);
      existing.endTime.push(slot.endTime as EndTime);
      existing.day.push(slot.day as Day);
      return;
    }

    grouped.set(key, {
      classNo: [slot.classNo as ClassNo],
      title: slot.title,
      lessonType: slot.lessonType,
      startTime: [slot.startTime as StartTime],
      endTime: [slot.endTime as EndTime],
      weeks: slot.weeks,
      venue: [venueName(slot.venue)],
      day: [slot.day as Day],
    });
  });

  return [...grouped.values()];
};

const scheduleKey = (slot: CleanClassTimeSlot) => JSON.stringify({
  title: slot.title,
  lessonType: slot.lessonType,
  startTime: slot.startTime,
  endTime: slot.endTime,
  weeks: slot.weeks,
  day: slot.day,
});

export const slotPreprocessing = (slots: SlotInput[]): CleanClassTimeSlot[] => {
  const grouped = new Map<string, CleanClassTimeSlot>();

  firstPass(slots).forEach((slot) => {
    const key = scheduleKey(slot);
    const existing = grouped.get(key);
    if (existing) {
      existing.classNo.push(...slot.classNo);
      existing.venue.push(...slot.venue);
      return;
    }
    grouped.set(key, { ...slot, classNo: [...slot.classNo], venue: [...slot.venue] });
  });

  return [...grouped.values()];
};

const toMinutes = (time: string): number => {
  const normalized = time.replace(':', '').padStart(4, '0');
  return Number(normalized.slice(0, 2)) * 60 + Number(normalized.slice(2, 4));
};

const numericWeeks = (weeks: Weeks | undefined): NumericWeeks | null => (
  Array.isArray(weeks) ? weeks : null
);

const weeksIntersect = (first: Weeks | undefined, second: Weeks | undefined): boolean => {
  const firstWeeks = numericWeeks(first);
  const secondWeeks = numericWeeks(second);
  if (!firstWeeks || !secondWeeks) return true;
  return firstWeeks.some((week) => secondWeeks.includes(week));
};

export const overlap = (first: CleanClassTimeSlot, second: CleanClassTimeSlot): boolean => {
  if (!weeksIntersect(first.weeks, second.weeks)) return false;

  return first.day.some((day, firstIndex) => second.day.some((otherDay, secondIndex) => {
    if (day !== otherDay) return false;
    const firstStart = toMinutes(first.startTime[firstIndex]);
    const firstEnd = toMinutes(first.endTime[firstIndex]);
    const secondStart = toMinutes(second.startTime[secondIndex]);
    const secondEnd = toMinutes(second.endTime[secondIndex]);
    return firstStart < secondEnd && secondStart < firstEnd;
  }));
};

export const checkOverlap = (slots: CleanClassTimeSlot[]): boolean => (
  slots.some((slot, index) => slots.slice(index + 1).some((other) => overlap(slot, other)))
);

export const backtrackingArrange = (timeSlots: CleanClassTimeSlot[]): boolean => {
  const groups = new Map<string, CleanClassTimeSlot[]>();
  timeSlots.forEach((slot) => {
    const key = `${slot.title}|${slot.lessonType || ''}`;
    groups.set(key, [...(groups.get(key) || []), slot]);
  });

  const partitions = [...groups.values()].sort((a, b) => a.length - b.length);
  const solution: CleanClassTimeSlot[] = [];

  const search = (partitionIndex: number): boolean => {
    if (partitionIndex === partitions.length) return true;
    for (const candidate of partitions[partitionIndex]) {
      if (solution.every((selected) => !overlap(candidate, selected))) {
        solution.push(candidate);
        if (search(partitionIndex + 1)) return true;
        solution.pop();
      }
    }
    return false;
  };

  return search(0) ? checkOverlap(solution) : true;
};
