export type AcadYear = string;      // 2023/2024
export type ClassNo = string;       // 16E 
export type StartTime = string;     // 1600
export type EndTime = string;       // 1700
export type Faculty = string;       // School of Computing
export type LessonTime = StartTime | EndTime;   
export type LessonType = string;    // Lecture
export type courseCode = string;    // CS1101S
export type courseName = string;    // Programming Methodology 
export type Semester = number;      // 1, 2 for sem1, 2; 3, 4 for special term I, II;
export const Semesters: readonly Semester[] = [1, 2, 3, 4];
export type Department = string;    // Computing
export type Workload = string | readonly number[];  // [2, 2, 1, 3, 2]  Lecture, Tutorial, Lab, Project, Prep
export type Location = {
    x: number;
    y: number;
}
export type Venue = {
    roomName:string;
    floor?:number;
    location:Location;     // coordination
};
export type Weeks = NumericWeeks | WeekRange;   // NumericWeeks for irregular schedule
export type NumericWeeks = readonly number[];   // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
export type Day = | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export const WorkingDays: readonly Day[] = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', ];
export const DaysOfWeek: readonly Day[] = [...WorkingDays, 'Sunday'];

export type WeekRange = {
    start: string;  // The start and end dates
    end: string;
    weekInterval?: number; // Number of weeks between each lesson. If not specified one week is assumed ie. there are lessons every week
    weeks?: number[];   // Week intervals for modules with uneven spacing between lessons
};

export interface GenericTimeSlot {
    title: string;
    startTime?: StartTime;
    endTime?: EndTime;
    day?: Day;
    color?: string;
}

export interface CustomizableTimeSlot extends GenericTimeSlot {
    // startTime: StartTime;
    // endTime: EndTime;
    // day: Day;
    venue?: string;

}

export interface ClassTimeSlotType extends GenericTimeSlot {
    classNo?: ClassNo;
    // startTime: StartTime;
    // endTime: EndTime;
    weeks?: Weeks;
    venue?: Venue;
    // day: Day;
    lessonType?: LessonType 
}

export type CourseSlotGroupType = {
    SlotCollection: ClassTimeSlotType[];
}