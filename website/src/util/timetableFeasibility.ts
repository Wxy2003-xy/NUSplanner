import { ClassTimeSlotType, ClassTimeSlotTypeUnion, Day } from '../types/timetable';
import { TimeTable } from './Timetable';

export type TimetableSlot = ClassTimeSlotType | ClassTimeSlotTypeUnion;

interface TimetableConstraints {
  days: readonly Day[];
  earliestStartTime: string;
}

export type TimetableFeasibility =
  | { status: 'empty'; arrangement: null; blockedLessons: string[] }
  | { status: 'infeasible'; arrangement: null; blockedLessons: string[] }
  | { status: 'feasible'; arrangement: ClassTimeSlotTypeUnion[]; blockedLessons: string[] };

const normalizeTime = (time: string): string => time.replace(':', '').padStart(4, '0');

export const groupTimetableSlots = (slots: TimetableSlot[]): ClassTimeSlotTypeUnion[] => {
  const groups = new Map<string, ClassTimeSlotTypeUnion>();

  for (const slot of slots) {
    const key = JSON.stringify([slot.title, slot.lessonType, slot.classNo]);
    const startTime = (Array.isArray(slot.startTime) ? slot.startTime : [slot.startTime as string]).map(normalizeTime);
    const endTime = (Array.isArray(slot.endTime) ? slot.endTime : [slot.endTime as string]).map(normalizeTime);
    const day = Array.isArray(slot.day) ? slot.day : [slot.day as Day];
    const weeks = Array.isArray(slot.weeks) && slot.weeks.length === 0 ? undefined : slot.weeks;
    const existing = groups.get(key);

    if (existing) {
      existing.startTime.push(...startTime);
      existing.endTime.push(...endTime);
      existing.day.push(...day);
    } else {
      groups.set(key, { ...slot, weeks, startTime, endTime, day: [...day] });
    }
  }

  return [...groups.values()];
};

export const evaluateTimetableFeasibility = (
  slots: TimetableSlot[],
  constraints: TimetableConstraints,
): TimetableFeasibility => {
  if (slots.length === 0) {
    return { status: 'empty', arrangement: null, blockedLessons: [] };
  }

  const groups = new Map<string, ClassTimeSlotTypeUnion[]>();
  for (const slot of groupTimetableSlots(slots)) {
    const key = JSON.stringify([slot.title, slot.lessonType]);
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  }

  const earliestStartTime = normalizeTime(constraints.earliestStartTime || '00:00');
  const blockedLessons: string[] = [];
  const partitions = [...groups.values()].map((options) => {
    const allowedOptions = options.filter((slot) => (
      slot.day.every((day) => constraints.days.includes(day))
      && slot.startTime.every((startTime) => startTime >= earliestStartTime)
    ));

    if (allowedOptions.length === 0) {
      blockedLessons.push([options[0].title, options[0].lessonType].filter(Boolean).join(' · '));
    }

    return allowedOptions;
  });

  if (blockedLessons.length > 0) {
    return { status: 'infeasible', arrangement: null, blockedLessons };
  }

  const arrangement = new TimeTable().findValidArrangement(partitions.sort((first, second) => first.length - second.length));
  return arrangement
    ? { status: 'feasible', arrangement, blockedLessons: [] }
    : { status: 'infeasible', arrangement: null, blockedLessons: [] };
};
