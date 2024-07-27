// import { StartTime, EndTime, ClassTimeSlotType, ClassTimeSlotTypeUnion, ClassNo, Day, Weeks } from '../types/timetable';
// import { isEqual, over, partition } from 'lodash';
// import { Clear } from '@mui/icons-material';
// import { ClassificationType } from "typescript";

// function logPartitionDetails(partition) {
//     partition.forEach((row, rowIndex) => {
//         console.log(`Partition ${rowIndex + 1}: size ${row.length}`);
//         row.forEach(slot => {
//             console.log(`Title: ${slot.title}, Lesson Type: ${slot.lessonType}, Class No: ${slot.classNo}, Day: ${slot.day}`);
//         });
//     });
// }
// function logRow(row) {
//     console.log('result: ')
//     row.forEach(slot => {
//         console.log(`Title: ${slot.title}, Lesson Type: ${slot.lessonType}, Class No: ${slot.classNo}, Day: ${slot.day}`);
//     });
// }
// const getKey = (slot: ClassTimeSlotType): SlotKey => {
//     const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
//     // console.log(key); // Debugging: Log out the keys to check for duplicates
//     return key;
// }
// const getPartialKey = (Slot: ClassTimeSlotType): SlotKey => {
//     return Slot.title+Slot.lessonType+Slot.classNo;
// }
// const timeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(':').map(Number);
//     return hours * 60 + minutes;
// };
// const areSlotsEqual = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
//     return slot1.classNo === slot2.classNo &&
//            slot1.lessonType === slot2.lessonType &&
//            slot1.title === slot2.title;
// }
// function transformSlots(slots: ClassTimeSlotType[]): ClassTimeSlotTypeUnion[] {
//     const grouped = new Map<string, ClassTimeSlotTypeUnion>();

//     slots.forEach(slot => {
//         const partialKey = `${slot.title}${slot.lessonType}${slot.classNo}`;
//         const existing = grouped.get(partialKey);

//         if (existing) {
//             existing.startTime.push(slot.startTime as string);
//             existing.endTime.push(slot.endTime as string);
//             existing.day.push(slot.day as Day);
//         } else {
//             grouped.set(partialKey, {
//                 classNo: slot.classNo,
//                 title: slot.title,
//                 lessonType: slot.lessonType,
//                 startTime: [slot.startTime as string],
//                 endTime: [slot.endTime as string],
//                 weeks: slot.weeks,
//                 venue: slot.venue,
//                 day: [slot.day as Day],
//             });
//         }
//     });
//     return Array.from(grouped.values());
// }

// const partitionTransform = (partitions: ClassTimeSlotType[][]): ClassTimeSlotTypeUnion[][] => {
//     const unioned = partitions.map(row => transformSlots(row));
//     return unioned;
// }

// const getPartialKeyUnion = (Slot: ClassTimeSlotTypeUnion): SlotKey => {
//     return Slot.title+Slot.lessonType+Slot.classNo;
// }

// export const overlapUnion = (slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean => {
//     if (!slot1 || !slot2) {
//         return false
//     }
//     for (const day1 of slot1.day) {
//         for (const day2 of slot2.day) {
//             if (day1 === day2) {
//                 for (let i = 0; i < slot1.startTime.length; i++) {
//                     for (let j = 0; j < slot2.startTime.length; j++) {
//                         const start1 = timeToMinutes(slot1.startTime[i]);
//                         const end1 = timeToMinutes(slot1.endTime[i]);
//                         const start2 = timeToMinutes(slot2.startTime[j]);
//                         const end2 = timeToMinutes(slot2.endTime[j]);
//                         if (!(end1 <= start2 || start1 >= end2)) {
//                             return true; 
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return false; 
// };

// const findCompatibleIdx = (unionedPartition: ClassTimeSlotTypeUnion[], 
//                             partialSolution: ClassTimeSlotTypeUnion[], startingIndex: number): number => {
//     for (let i = startingIndex; i < unionedPartition.length; i++) {
//         let compatible: boolean = true;
//         for (let j = 0; j < partialSolution.length; j++) {
//             compatible = compatible && (!overlapUnion(unionedPartition[i], partialSolution[j]))
//             if (compatible) {
//                 return i;
//             }
//         }   
//     }
//     return -1;
// }


// function generateAllCombinations(slots: ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[][] {
//     function recurse(index: number, current: ClassTimeSlotTypeUnion[], all: ClassTimeSlotTypeUnion[][]): void {
//         if (index === slots.length) {
//             all.push(current.slice()); 
//             return;
//         }
//         for (const slot of slots[index]) {
//             current.push(slot);
//             recurse(index + 1, current, all);
//             current.pop();
//         }
//     }

//     const allCombinations: ClassTimeSlotTypeUnion[][] = [];
//     recurse(0, [], allCombinations);
//     return allCombinations;
// }
// export function arrange(timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] {
//     const groups = new Map<string, ClassTimeSlotTypeUnion[]>();
//     timeslots.forEach(slot => {
//         const key = `${slot.title}${slot.lessonType}`;
//         if (!groups.has(key)) {
//             groups.set(key, []);
//         }
//         groups.get(key).push(slot);
//     });
//     const unionedPartitions: ClassTimeSlotTypeUnion[][] = Array.from(groups.values());

//     const combinations = generateAllCombinations(unionedPartitions);
//     for (const combination of combinations) {
//         if (isValidCombination(combination)) {
//             return combination; 
//         }
//     }
//     return []; 
// }

// function isValidCombination(combination: ClassTimeSlotTypeUnion[]): boolean {
//     for (let i = 0; i < combination.length; i++) {
//         for (let j = i + 1; j < combination.length; j++) {
//             if (overlapUnion(combination[i], combination[j])) {
//                 return false; // Overlap found, combination is not valid
//             }
//         }
//     }
//     return true; // No overlaps found, combination is valid
// }

// export const arrange3 = (timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[]=> {
//     const groups = new Map<string, ClassTimeSlotTypeUnion[]>();
//     timeslots.forEach(slot => {
//         const key = `${slot.title}${slot.lessonType}`;
//         if (!groups.has(key)) {
//             groups.set(key, []);
//         }
//         groups.get(key).push(slot);
//     });
//     const unionedPartitions: ClassTimeSlotTypeUnion[][] = Array.from(groups.values());
//     logPartitionDetails(unionedPartitions)

//     const partialSolution: ClassTimeSlotTypeUnion[] = [];
//     const solutionSize: number = unionedPartitions.length;
//     const selectedIndex = new Array(solutionSize).fill(0);
//     let currTypeIdx = 0;
//     let currSlotIdx = 0;
//     partialSolution.push(unionedPartitions[0][0]);
//     currTypeIdx++;
//     while (currTypeIdx < solutionSize) {
//         if (currTypeIdx < 0) {
//             console.log('no solution')
//             return [];
//         }
//         selectedIndex[currTypeIdx] = findCompatibleIdx(unionedPartitions[currTypeIdx], partialSolution, selectedIndex[currTypeIdx]);
//         if (selectedIndex[currTypeIdx] === -1) {
//             console.log('backtracking, discarding: ' + currTypeIdx + ' ' + selectedIndex[currTypeIdx])
//             currTypeIdx--;
//             partialSolution.pop();
//             selectedIndex[currTypeIdx] = 0;
//         } else {
//             partialSolution.push(unionedPartitions[currTypeIdx][selectedIndex[currTypeIdx]]);
//             currTypeIdx++;
//         }
//     }
//     console.log(selectedIndex)
//     console.log(unionedPartitions[currTypeIdx][0])
//     return partialSolution;
// };
// export type SlotType = string;
// export type SlotKey = string;



// export const arrange2 = (timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
//     let bestSolution: ClassTimeSlotTypeUnion[] = [];
//     const canAddSlotToSolution = (slot: ClassTimeSlotTypeUnion, currentSolution: ClassTimeSlotTypeUnion[]): boolean => {
//         return currentSolution.every(existingSlot => !overlapUnion(slot, existingSlot));
//     };
//     const findArrangement = (index: number, currentSolution: ClassTimeSlotTypeUnion[]) => {
//         if (index === timeslots.length) {
//             // If we reach the end and have a valid configuration with more slots than any previous, store it
//             if (currentSolution.length > bestSolution.length) {
//                 bestSolution = currentSolution.slice(); // Copy the solution
//             }
//             return;
//         }
//         // Try to include this slot in the solution if it doesn't overlap with current solution
//         const slot = timeslots[index];
//         if (canAddSlotToSolution(slot, currentSolution)) {
//             currentSolution.push(slot);
//             findArrangement(index + 1, currentSolution);
//             currentSolution.pop(); // Backtrack
//         }
//         // Always try to skip the current slot to explore other possibilities
//         findArrangement(index + 1, currentSolution);
//     };
//     // Start recursive search from the first slot
//     findArrangement(0, []);
//     return bestSolution;
// };

// function hashMapTo2DArray(partition: Map<string, ClassTimeSlotTypeUnion>): ClassTimeSlotTypeUnion[][] {
//     // Convert map values to a 2D array
//     return Array.from(partition.values()).map(slot => [slot]);
// }

// export function arrange4(slotList: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] {
//     console.log(slotList.length);

//     if (!slotList || slotList.length === 0) return [];
//     const partition = new Map<string, ClassTimeSlotTypeUnion>();
//     slotList.forEach(slot => {
//         const key = getPartialKeyUnion(slot);
//         partition.set(key, slot);
//     });

//     const array = hashMapTo2DArray(partition);
//     console.log(`Converted Array: ${JSON.stringify(array)}`);
//     if (array.length === 0) return [];
//     const visited: boolean[][] = array.map(row => new Array(row.length).fill(false));
//     const solution: ClassTimeSlotTypeUnion[] = [];
//     let curr = 1;
//     solution.push(array[0][0]);  // Assuming there's at least one slot in the first group
//     console.log(JSON.stringify(solution))
//     while (curr < array.length) {
//         let canProceed = false;
//         for (let i = 0; i < array[curr].length; i++) {
//             const currentSlot = array[curr][i];
//             const compatible = solution.every(slot => !overlapUnion(currentSlot, slot));
//             console.log(`Checking overlap between ${JSON.stringify(currentSlot)} and current solution: ${compatible}`);

//             if (compatible) {
//                 solution.push(currentSlot);
//                 visited[curr][i] = true;
//                 canProceed = true;
//                 break;
//             }
//         }

//         if (canProceed) {
//             curr++;
//         } else {
//             if (curr > 0) {
//                 solution.pop(); // Backtrack by removing the last added slot
//                 curr--; // Move back to the previous group
//             } else {
//                 // If curr is 0 and no compatible slot is found, return empty as no solution is possible from the start.
//                 return [];
//             }
//         }
//     }

//     return solution;
// }