import { overlap } from "../util/arrangeWithUnionedSlots"; // Adjust the path as necessary
import { CleanClassTimeSlot } from "../types/timetable";

describe('Overlap Function Tests', () => {
  const slot1: CleanClassTimeSlot = {
    classNo: ["10"],
    title: "CS2100",
    lessonType: "Tutorial",
    startTime: ["0900"],
    endTime: ["1000"],
    weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    venue: [],
    day: ["Friday"]
  };

  const slot2: CleanClassTimeSlot = {
    classNo: ["19"],
    title: "CS2100",
    lessonType: "Tutorial",
    startTime: ["0930"],
    endTime: ["1030"],
    weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    venue: [],
    day: ["Friday"]
  };

  const slot3: CleanClassTimeSlot = {
    classNo: ["20"],
    title: "CS2100",
    lessonType: "Tutorial",
    startTime: ["1100"],
    endTime: ["1200"],
    weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    venue: [],
    day: ["Friday"]
  };

  const slot4: CleanClassTimeSlot = {
    classNo: ["1"],
    title: "CS2100",
    lessonType: "Tutorial",
    startTime: ["1100", "1700"],
    endTime: ["1200", "1800"],
    weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    venue: [],
    day: ["Monday", "Tuesday"]
  }

  const slot5: CleanClassTimeSlot = {
    classNo: ["3"],
    title: "CS2102",
    lessonType: "Tutorial",
    startTime: ["0900", "1100"],
    endTime: ["1000", "1200"],
    weeks: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    venue: [],
    day: ["Monday", "Tuesday"]
  }

  test('should detect overlap when slots overlap on the same day and time', () => {
    expect(overlap(slot1, slot2)).toBe(true);
  });

  test('should not detect overlap', () => {
    expect(overlap(slot4, slot5)).toBe(false);
  });

});
