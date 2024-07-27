// import { Comparator, partition, random } from 'lodash';
// import { ClassTimeSlotTypeUnion, ClassTimeSlotType } from '../types/timetable';

// interface ClassTimeSlotwithKey extends ClassTimeSlotTypeUnion {
//     key: string;
// }

// const getKey = (slot: ClassTimeSlotTypeUnion): string => {
//     const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
//     // console.log(key); // Debugging: Log out the keys to check for duplicates
//     return key;
// }

// const assignKey = (slot: ClassTimeSlotTypeUnion): ClassTimeSlotwithKey => {
//     return {
//         ...slot,
//         key: getKey(slot)
//     };
// }

// const mapKey = (slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotwithKey[] => {
//     return slots.map(s => assignKey(s));
// }

// const buildRefMap = (slots: ClassTimeSlotTypeUnion[]): Map<string, ClassTimeSlotTypeUnion> => {
//     const refMap = new Map<string, ClassTimeSlotTypeUnion>();
//     slots.forEach(slot => {
//         const slotWithKey = assignKey(slot);
//         refMap.set(slotWithKey.key, slot); 
//     });
//     return refMap;
// }
// export const partitionSlots = (timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[][] => {
//     const courses = new Map<string, ClassTimeSlotTypeUnion[]>();
//     timeslots.forEach(slot => {
//         const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
//         if (!courses.has(title)) {
//             courses.set(title, []);
//         }
//         courses.get(title)?.push(slot);
//     });
//     const partitions: ClassTimeSlotTypeUnion[][] = Array.from(courses.values());
//     return partitions;
// }
// const sortPartitionByChoice = (partitions: ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[][] => {
//     const res = partitions.sort((a, b) => a.length - b.length);
//     return res;
// }
// const getTotalLength = (slot: ClassTimeSlotTypeUnion): number => {
//     const num = slot.day.length;
//     let totalMinutes: number = 0;
//     for (let i = 0; i < num; i++) {
//         totalMinutes = totalMinutes + parseInt(slot.endTime[i]) - parseInt(slot.startTime[i]);
//     }
//     return totalMinutes;
// }
// const sortPartitionByLength = (partitions: ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[][] => {
//     const res = partitions.sort((a, b) => getTotalLength(a[0]) - getTotalLength(b[0]));
//     return res;
// }
// const timeToMinutes = (time: string): number => {
//     const hours = parseInt(time.substring(0, 2));
//     const minutes = parseInt(time.substring(2, 4));
//     return hours * 60 + minutes;
// };
// const overlap = (slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean => {
//     for (let i = 0; i < slot1.day.length; i++) {
//         for (let j = 0; j < slot2.day.length; j++) {
//             if (slot1.day[i] === slot2.day[j]) {
//                 const start1 = timeToMinutes(slot1.startTime[i]);
//                 const end1 = timeToMinutes(slot1.endTime[i]);
//                 const start2 = timeToMinutes(slot2.startTime[j]);
//                 const end2 = timeToMinutes(slot2.endTime[j]);
//                 if (!(end1 <= start2 || start1 >= end2)) {
//                     return true; // Overlap found
//                 }
//             }
//         }
//     }
//     return false;
// };
// export const indexMapping = (partitions: ClassTimeSlotTypeUnion[][]): number[][] => {
//     return partitions.map(group => group.map((_, index) => index));
// }
// export const backMappingResult = (indices:number[], partitions:ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[] => {
//     const res: ClassTimeSlotTypeUnion[] = new Array(indices.length);
//     for (let i = 0; i < indices.length; i++) {
//         if (indices[i] === -1) {
//             console.log('no possible arrangement')
//             return [];
//         }
//         res[i] = partitions[i][indices[i]]
//     }
//     return res;
// }
// const flattenIndex = (row: number, col: number, partitionsIndices: number[][]): number => {
//     let res = 0;
//     for (let i = 0; i < row; i++) { 
//         res += partitionsIndices[i].length;
//     }
//     return res + col;
// }
// const backMappingRow = (flatIndex: number, partitionsIndices: number[][]): number => {
//     let idx = flatIndex;
//     for (let i = 0; i < partitionsIndices.length; i++) {
//         if (idx < partitionsIndices[i].length) {
//             return i;
//         }
//         idx -= partitionsIndices[i].length; 
//     }
//     throw new Error("Flat index out of bounds"); 
// }
// const backMappingCol = (flatIndex: number, partitionsIndices: number[][]): number => {
//     let idx = flatIndex;
//     for (let i = 0; i < partitionsIndices.length; i++) {
//         if (idx < partitionsIndices[i].length) {
//             return idx; // Return the remaining index as the column index within the found row
//         }
//         idx -= partitionsIndices[i].length; // Subtract the length of the current row from the flat index
//     }
//     throw new Error("Flat index out of bounds"); // Handle out of bounds error
// }
// const buildAdjacencyMatrix = (partitions: ClassTimeSlotTypeUnion[][]): number[][] => {
//     const n = partitions.length;
//     const adjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));

//     for (let i = 0; i < n; i++) {
//         for (let j = i; j < n; j++) {
//             if (i === j) {
//                 // Check for overlaps within the same partition
//                 let hasOverlap = false;
//                 for (let x = 0; x < partitions[i].length; x++) {
//                     for (let y = x + 1; y < partitions[i].length; y++) {
//                         if (overlap(partitions[i][x], partitions[i][y])) {
//                             hasOverlap = true;
//                             break;
//                         }
//                     }
//                     if (hasOverlap) break;
//                 }
//                 adjacencyMatrix[i][i] = hasOverlap ? 0 : 1; // Set to 0 if overlaps exist within the same partition
//             } else {
//                 // Check for overlaps between different partitions
//                 let hasOverlap = false;
//                 for (let x = 0; x < partitions[i].length && !hasOverlap; x++) {
//                     for (let y = 0; y < partitions[j].length; y++) {
//                         if (overlap(partitions[i][x], partitions[j][y])) {
//                             hasOverlap = true;
//                             break;
//                         }
//                     }
//                 }
//                 adjacencyMatrix[i][j] = adjacencyMatrix[j][i] = hasOverlap ? 0 : 1; // Symmetric, so set both [i][j] and [j][i]
//             }
//         }
//     }
//     return adjacencyMatrix;
// }

// export const greedyArrange = (slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
//     const partitions = partitionSlots(slots);
//     const sortedByChoice = sortPartitionByChoice(partitions);
//     const solution: ClassTimeSlotTypeUnion[] = new Array(partitions.length);
//     let fixedRows = 0;
//     for (let i = 0; i < sortedByChoice.length; i++) {
//         if (sortedByChoice[i].length > 1) {
//             break;
//         }
//         solution[i] = sortedByChoice[i][0];
//         fixedRows++;
//     }
//     const sortedByLength = sortPartitionByLength(sortedByChoice.filter(row => row.length>1));
//     const partialSolution: number[] = new Array(partitions.length - fixedRows);
//     const indexMap: number[][] = indexMapping(sortedByLength);
//     const adjacencyMatrix:number[][] = buildAdjacencyMatrix(sortedByLength);
//     let curr = 0;
//     while (curr < indexMap.length) {
//         partialSolution[curr] = 0
//         curr++
//     }
//     return backMappingResult(partialSolution, sortedByLength).concat(solution)

// };


