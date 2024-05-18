import { Module } from '../types/modules'; // Ensure to import the type correctly based on your file structure

const sampleModule: Module = {
  acadYear: "2022/2023",
  moduleCode: "CS2100",
  title: "Computer Organisation",
  description: "This module introduces the fundamentals of how modern computer systems work, covering topics from computer architecture to assembly language.",
  moduleCredit: "4",
  department: "Computer Science",
  faculty: "School of Computing",
  workload: [2, 1, 1, 3, 3], // Corresponding to lecture, tutorial, lab, project, preparation hours per week
  aliases: ["CS2100"],
  attributes: {
    year: false,
    su: true,
    grsu: false,
    ssgf: false,
    sfs: false,
    lab: true,
    ism: false,
    urop: false,
    fyp: false,
    mpes1: true,
    mpes2: true
  },
  gradingBasisDescription: "Graded on a bell curve.",
  additionalInformation: "Students are required to participate in lab sessions to complete this module.",
  prerequisite: "CS1101S or its equivalent",
  prerequisiteRule: "Must have passed CS1101S.",
  prerequisiteAdvisory: "Recommended to have strong programming skills.",
  corequisite: "",
  corequisiteRule: "",
  preclusion: "CS2100E",
  preclusionRule: "Students who have taken CS2100E cannot take this module.",
  semesterData: [
    {
      semester: 1,
      timetable: [
        {
          classNo: "01",
          day: "Monday",
          startTime: "1400",
          endTime: "1600",
          lessonType: "Lecture",
          venue: "LT19",
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        },
        {
          classNo: "02",
          day: "Tuesday",
          startTime: "1000",
          endTime: "1200",
          lessonType: "Tutorial",
          venue: "COM1-0208",
          weeks: [2, 4, 6, 8, 10, 12]
        }
      ],
      examDate: "2023-11-30",
      examDuration: 120 // Exam duration in minutes
    }
  ],
  prereqTree: { and: ["CS1101S", { or: ["MA1521", "MA1102R"] }] },
  fulfillRequirements: ["CS2100"],
  timestamp: Date.now()
};

export default sampleModule;
