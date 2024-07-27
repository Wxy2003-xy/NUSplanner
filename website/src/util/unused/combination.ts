// import { ClassTimeSlotTypeUnion } from "../types/timetable";

// function timeToMinutes(time: string): number {
//     const [hours, minutes] = time.split(':').map(Number);
//     return hours * 60 + minutes;
// }

// function overlapUnion(slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean {
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
//                             console.log(`Overlap detected between slots: ${JSON.stringify(slot1)} and ${JSON.stringify(slot2)}`);
//                             return true;
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return false;
// }


// function areAllNonOverlapping(slots: ClassTimeSlotTypeUnion[]): boolean {
//     for (let i = 0; i < slots.length; i++) {
//         for (let j = i + 1; j < slots.length; j++) {
//             if (overlapUnion(slots[i], slots[j])) {
//                 console.log(`Overlap detected between slot ${i} and slot ${j}`);
//                 return false; // Overlap detected, so not all items are non-overlapping
//             }
//         }
//     }
//     return true; // No overlaps found among all items
// }

// function generateIndexCombinations(rows: ClassTimeSlotTypeUnion[][]): number[][] {
//     console.log(rows.length)
//     for (let i = 0; i < rows.length; i++) {
//         console.log(rows[i].length)
//     }
//     // Calculate the total number of combinations
//     const totalCombinations = rows.reduce((acc, row) => acc * row.length, 1);
//     console.log(totalCombinations)
//     // Initialize combinations array with empty arrays for each combination
//     const combinations: number[][] = new Array(totalCombinations).fill(0).map(() => new Array(rows.length));
//     // The multiplier determines the total number of times an index repeats consecutively
//     let multiplier = totalCombinations;
//     // Fill each column of the combinations matrix
//     rows.forEach((row, rowIndex) => {
//         multiplier /= row.length;
//         let index = 0; // Index within the current row
//         for (let i = 0; i < totalCombinations; i++) {
//             combinations[i][rowIndex] = index;
//             // Update the index every 'multiplier' iterations
//             if ((i + 1) % multiplier === 0) {
//                 index = (index + 1) % row.length;
//             }
//         }
//     });
//     console.log(combinations.length)
//     return combinations;
// }

// export const combinationArrange = (slots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] | null => {
//     const groups = new Map<string, ClassTimeSlotTypeUnion[]>();
//     slots.forEach(slot => {
//         const key = `${slot.title}${slot.lessonType}`;
//         if (!groups.has(key)) {
//             groups.set(key, []);
//         }
//         groups.get(key).push(slot);
//     });
//     const unionedPartitions: ClassTimeSlotTypeUnion[][] = Array.from(groups.values());
//     const combinations = generateIndexCombinations(unionedPartitions);
//     for (let i = 0; i < combinations.length; i++) {
//         const comb: ClassTimeSlotTypeUnion[] = [];
//         for (let j = 0; j < unionedPartitions.length; j++) {
//             console.log(i + ' th combination, '+j+' th type ' +combinations[i][j]+' slot')
//             comb.push(unionedPartitions[j][combinations[i][j]])
//         }
//         if (areAllNonOverlapping(comb)) {
//             return comb;
//         }
//     }
//     return [];
// }
