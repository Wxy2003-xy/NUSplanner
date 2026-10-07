import { ClassTimeSlotType, ClassTimeSlotTypeUnion, Day } from '../types/timetable';
import { evaluateTimetableFeasibility, groupTimetableSlots } from '../util/timetableFeasibility';
import { TimeTable } from '../util/Timetable';

const slot = (overrides: Partial<ClassTimeSlotType> = {}): ClassTimeSlotType => ({
  title: 'CS1101S',
  lessonType: 'Lecture',
  classNo: '1',
  day: 'Monday',
  startTime: '0900',
  endTime: '1000',
  weeks: [1, 2, 3],
  venue: 'COM1',
  ...overrides,
});

const constraints = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Day[],
  earliestStartTime: '08:00',
};

describe('timetable feasibility under the current constraints', () => {
  test('does not report an empty timetable as feasible or impossible', () => {
    expect(evaluateTimetableFeasibility([], constraints).status).toBe('empty');
  });

  test('reports infeasibility instead of restoring classes on excluded days', () => {
    const result = evaluateTimetableFeasibility([slot({ day: 'Friday' })], {
      ...constraints,
      days: ['Monday'],
    });
    expect(result).toEqual({
      status: 'infeasible',
      arrangement: null,
      blockedLessons: ['CS1101S · Lecture'],
    });
  });

  test('reports infeasibility instead of restoring classes before the earliest start', () => {
    const result = evaluateTimetableFeasibility([slot()], { ...constraints, earliestStartTime: '10:00' });
    expect(result.status).toBe('infeasible');
    expect(result.arrangement).toBeNull();
  });

  test('keeps every required lesson type even if only one is excluded', () => {
    const result = evaluateTimetableFeasibility([
      slot(),
      slot({ lessonType: 'Tutorial', day: 'Tuesday' }),
    ], { ...constraints, days: ['Monday'] });
    expect(result.status).toBe('infeasible');
    expect(result.blockedLessons).toEqual(['CS1101S · Tutorial']);
  });

  test('requires every meeting of a class to be on an allowed day', () => {
    const result = evaluateTimetableFeasibility([
      slot(),
      slot({ day: 'Tuesday' }),
    ], { ...constraints, days: ['Monday'] });
    expect(result.status).toBe('infeasible');
  });

  test('requires every meeting of a class to start at or after the earliest time', () => {
    const result = evaluateTimetableFeasibility([
      slot({ startTime: '1100', endTime: '1200' }),
      slot({ day: 'Tuesday', startTime: '0800', endTime: '0900' }),
    ], { ...constraints, earliestStartTime: '10:00' });
    expect(result.status).toBe('infeasible');
  });

  test('reports infeasibility when no days are selected', () => {
    const result = evaluateTimetableFeasibility([slot()], { ...constraints, days: [] });
    expect(result.status).toBe('infeasible');
  });

  test('reports infeasibility when all allowed class combinations clash', () => {
    const result = evaluateTimetableFeasibility([
      slot(),
      slot({ title: 'CS1231S', startTime: '0930', endTime: '1030' }),
    ], constraints);
    expect(result).toEqual({ status: 'infeasible', arrangement: null, blockedLessons: [] });
  });

  test('finds an alternative class that satisfies both constraints without clashes', () => {
    const result = evaluateTimetableFeasibility([
      slot(),
      slot({ title: 'CS1231S' }),
      slot({ title: 'CS1231S', classNo: '2', day: 'Tuesday' }),
      slot({ lessonType: 'Tutorial', startTime: '1000', endTime: '1100' }),
    ], constraints);
    expect(result.status).toBe('feasible');
    expect(result.arrangement).toHaveLength(3);
    expect(result.arrangement?.find((lesson) => lesson.title === 'CS1231S')?.classNo).toBe('2');
  });

  test('allows a class exactly at the earliest start and back-to-back lessons', () => {
    const result = evaluateTimetableFeasibility([
      slot(),
      slot({ title: 'CS1231S', startTime: '1000', endTime: '1100' }),
    ], { ...constraints, earliestStartTime: '09:00' });
    expect(result.status).toBe('feasible');
  });

  test('handles saved grouped classes and custom slots without nesting arrays or mutating the cache', () => {
    const grouped: ClassTimeSlotTypeUnion = {
      title: 'CS1101S', lessonType: 'Lecture', classNo: '1',
      day: ['Monday', 'Tuesday'], startTime: ['09:00', '11:00'], endTime: ['10:00', '12:00'],
    };
    const original = JSON.stringify(grouped);
    const result = evaluateTimetableFeasibility([
      grouped,
      slot({ title: 'Custom commitment', startTime: '10:00', endTime: '11:00' }),
    ], constraints);
    expect(result.status).toBe('feasible');
    expect(result.arrangement?.find((lesson) => lesson.title === 'CS1101S')?.startTime).toEqual(['0900', '1100']);
    expect(JSON.stringify(grouped)).toBe(original);
  });

  test('recovers as soon as the user relaxes the blocking constraint', () => {
    const lessons = [slot({ day: 'Tuesday' })];
    expect(evaluateTimetableFeasibility(lessons, { ...constraints, days: ['Monday'] }).status).toBe('infeasible');
    expect(evaluateTimetableFeasibility(lessons, { ...constraints, days: ['Monday', 'Tuesday'] }).status).toBe('feasible');
  });

  test('detects short overlaps that do not start on half-hour boundaries', () => {
    const result = evaluateTimetableFeasibility([
      slot({ startTime: '0915', endTime: '0945' }),
      slot({ title: 'CS1231S', startTime: '0930', endTime: '1000' }),
    ], constraints);
    expect(result.status).toBe('infeasible');
  });

  test('allows classes in separate teaching weeks to share a time', () => {
    const result = evaluateTimetableFeasibility([
      slot({ weeks: [1, 3, 5] }),
      slot({ title: 'CS1231S', weeks: [2, 4, 6] }),
    ], constraints);
    expect(result.status).toBe('feasible');
  });

  test('checks clashes for saved custom commitments with unspecified teaching weeks', () => {
    const result = evaluateTimetableFeasibility([
      slot(),
      slot({ title: 'Custom commitment', weeks: [] }),
    ], constraints);
    expect(result.status).toBe('infeasible');
  });

  test('respects existing occupied slots when finding an arrangement', () => {
    const timetable = new TimeTable();
    const [occupied] = groupTimetableSlots([slot()]);
    timetable.addSlot(occupied);
    expect(timetable.findValidArrangement([groupTimetableSlots([slot({ title: 'CS1231S' })])])).toBeNull();
    timetable.removeSlot(occupied);
    expect(timetable.findValidArrangement([groupTimetableSlots([slot({ title: 'CS1231S' })])])).toHaveLength(1);
  });
});
