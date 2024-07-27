// import { StartTime, EndTime, ClassTimeSlotType, ClassTimeSlotTypeUnion, ClassNo, Day, Weeks } from '../types/timetable';
// import { isEqual, over, partition } from 'lodash';
// import { Clear } from '@mui/icons-material';
// import { ClassificationType } from "typescript";

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
//             // Append to existing arrays
//             existing.startTime.push(slot.startTime);
//             existing.endTime.push(slot.endTime);
//             existing.day.push(slot.day);
//         } else {
//             // Create new entry in map
//             grouped.set(partialKey, {
//                 classNo: slot.classNo,
//                 title: slot.title,
//                 lessonType: slot.lessonType,
//                 startTime: [slot.startTime],
//                 endTime: [slot.endTime],
//                 weeks: slot.weeks,
//                 venue: slot.venue,
//                 day: [slot.day],
//             });
//         }
//     });

//     // Convert the map values to an array
//     return Array.from(grouped.values());
// }

// export const overlap = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
//     if (slot1.day !== slot2.day) {
//         return false;
//     }
//     if (!slot1.startTime || !slot1.endTime || !slot2.startTime || !slot2.endTime) {
//         return false;
//     }
//     const start1 = timeToMinutes(slot1.startTime);
//     const end1 = timeToMinutes(slot1.endTime);
//     const start2 = timeToMinutes(slot2.startTime);
//     const end2 = timeToMinutes(slot2.endTime);
//     return !(end1 <= start2 || start1 >= end2);
// };
// export const overlapUnion = (slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean => {
//     // Check each day in slot1 against each day in slot2
//     for (const day1 of slot1.day) {
//         for (const day2 of slot2.day) {
//             if (day1 === day2) {
//                 // Only check times if days are the same
//                 for (let i = 0; i < slot1.startTime.length; i++) {
//                     for (let j = 0; j < slot2.startTime.length; j++) {
//                         const start1 = timeToMinutes(slot1.startTime[i]);
//                         const end1 = timeToMinutes(slot1.endTime[i]);
//                         const start2 = timeToMinutes(slot2.startTime[j]);
//                         const end2 = timeToMinutes(slot2.endTime[j]);

//                         // Check for time overlap
//                         if (!(end1 <= start2 || start1 >= end2)) {
//                             return true; // Overlap found
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return false; // No overlap found
// };

// export const arrange = (timeslots: ClassTimeSlotType[]): ClassTimeSlotType[] | null => {
//     const courses = new Map<string, ClassTimeSlotType[]>();
//     timeslots.forEach(slot => {
//         const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
//         if (!courses.has(title)) {
//             courses.set(title, []);
//         }
//         courses.get(title)?.push(slot);
//     });
//     const partitions: ClassTimeSlotType[][] = Array.from(courses.values());
//     const dfsCliqueFinding = (partition: ClassTimeSlotType[][]): ClassTimeSlotType[] => {
//         logPartitionDetails(partition)
//         const slotTypes = partition.length;
//         const partialSolution: ClassTimeSlotType[] = [];
//         let currentTypeIndex = 0;
//         let currentSlotIndex = 0;
//         console.log('push (' + currentTypeIndex + ', ' + currentSlotIndex + ')')
//             const sameNo = sameClassNo(partition[currentTypeIndex][currentSlotIndex], partition[currentTypeIndex]);
//             sameNo.forEach(s => {
//                 console.log('adding before loop: ' + getKey(s))
//                 partialSolution.push(s);
//             })
//         currentTypeIndex++;
//         while (currentTypeIndex < slotTypes) {
//             let canProceed = false
//             const partialSolutionSize = partialSolution.length;
//             // console.log('before next iteration: ' + logRow(partialSolution))
//             for (let i = currentSlotIndex; i < partition[currentTypeIndex].length; i++) {
//                 // console.log('iterating: ' + i)
//                 if (checkCompatible(partition[currentTypeIndex][i], partialSolution)) {
//                     const sameNo = sameClassNo(partition[currentTypeIndex][i], partition[currentTypeIndex]);
//                     console.log(sameNo.length)
//                     if (sameNo.length > 0) {
//                         currentSlotIndex = i;
//                         sameNo.forEach(s => {
//                             console.log('adding inside loop: ' + getKey(s))
//                             partialSolution.push(s);
//                         })
//                         console.log('add set: ' + sameNo.length)
//                         canProceed = true;
//                         break;
//                     }
//                     // currentSlotIndex = i;
//                     // console.log('added')
//                     // console.log('push (' + currentTypeIndex + ', ' + currentSlotIndex + ')')
//                     // partialSolution.push(partition[currentTypeIndex][i]);
//                     // canProceed = true;
//                     if (i === partition[currentTypeIndex].length - 1) {
//                         canProceed = false;
//                     }
//                 }
//             }
//             console.log(partialSolution.length +'::'+ partialSolutionSize)
//             if (!canProceed) {  
//                 console.log('to remove')     // no addition, backtrack
//                 const toRemove = partialSolution.pop();
//                 partialSolution.filter(s => 
//                 getPartialKey(s) !== getPartialKey(toRemove))
//                 console.log('after popping: ' + logRow(partialSolution))
                
//                 if (currentTypeIndex === 0) {
//                     console.log('terminate')
//                     return partialSolution
//                 } else {
//                     currentTypeIndex -=1;
//                 }
//             } else {                    
//                 console.log('proceed: ' + currentTypeIndex + ' ++ ')                                // success, proceed
//                 currentTypeIndex++;
//                 currentSlotIndex = 0;
//             }
//         }
//         return partialSolution;
//     }
//     const res = dfsCliqueFinding(partitions)
//     // logRow(res)
//     return res
// };
// export type SlotType = string;
// export type SlotKey = string;

// const isConnectedfromSlot = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
//     // console.log(getKey(slot1)+ ' :: ' + getKey(slot2) + ':  ' + !overlap(slot1, slot2) && (getKey(slot1) !== getKey(slot2)))
//      return !overlap(slot1, slot2) && (getPartialKey(slot1) !== getPartialKey(slot2));
// }

// const compatiblefromSlot = (partition: ClassTimeSlotType[][], partialSolution: ClassTimeSlotType[]): ClassTimeSlotType[] => {
//     const compatibleSet: ClassTimeSlotType[] = [];
//     partition.forEach(row => row.forEach(slot1 => {
//         partialSolution.forEach(slot2 => {
//             if (isConnectedfromSlot(slot1, slot2)) {
//                 compatibleSet.push(slot1);
//             }
//         })
//     }))
//     return compatibleSet;
// }

// const checkCompatible = (slot: ClassTimeSlotType, partialSolution:ClassTimeSlotType[]): boolean => {
//     partialSolution.forEach(s => {
//         if (!isConnectedfromSlot(slot, s)) {
//             return false;
//         }
//     })
//     return true
// }

// const sameClassNo = (slot: ClassTimeSlotType, row: ClassTimeSlotType[]): ClassTimeSlotType[] => {
//     const res: ClassTimeSlotType[] = [];
//     row.forEach(s => {
//         if (getPartialKey(s) === getPartialKey(slot)) {
//             res.push(s)
//         }
//     })
//     return res;
// }

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
//   const getPartialKey = (Slot: ClassTimeSlotType): SlotKey => {
//     return Slot.title+Slot.lessonType+Slot.classNo;
//   }

//   export const DFSUnionArrange = (timeSlots: ClassTimeSlotType[]): ClassTimeSlotTypeUnion[] => {
//     const courses = new Map<string, ClassTimeSlotType[]>();
//     timeSlots.forEach(slot => {
//         const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
//         if (!courses.has(title)) {
//             courses.set(title, []);
//         }
//         courses.get(title)?.push(slot);
//     });
//     const partitions: ClassTimeSlotType[][] = Array.from(courses.values());
//     logPartitionDetails(partitions);
//     return DFSUnion(partitions.flat());
//   }

//   export const DFSUnion = (partition: ClassTimeSlotType[]): ClassTimeSlotTypeUnion[] => {
//     // Flatten the partition to get a list of all slots
//     const flatSlots: ClassTimeSlotTypeUnion[] = transformSlots(partition);

//     // Building the adjacency matrix
//     const adjacencyMatrix: number[][] = flatSlots.map(() => new Array(flatSlots.length).fill(0));
//     for (let i = 0; i < flatSlots.length; i++) {
//         for (let j = 0; j < flatSlots.length; j++) {
//             if (i !== j && !overlapUnion(flatSlots[i], flatSlots[j])) {
//                 adjacencyMatrix[i][j] = 1;  // Set connection if there is no overlap
//             }
//         }
//     }

//     console.log("Adjacency Matrix:");
//     console.log(adjacencyMatrix.map(row => `[${row.join(', ')}]`).join(',\n'));



//     // Array to track visited nodes
//     const visited = new Array(flatSlots.length).fill(false);
//     const result: ClassTimeSlotTypeUnion[] = [];
//     let maxClique: ClassTimeSlotTypeUnion[] = [];
//     // Helper function for DFS
//     const dfs = (nodeIndex: number) => {
//         visited[nodeIndex] = true;
//         result.push(flatSlots[nodeIndex]);  // Store the slot as part of the result

//         // Explore adjacent nodes
//         for (let i = 0; i < adjacencyMatrix[nodeIndex].length; i++) {
//             if (adjacencyMatrix[nodeIndex][i] === 1 && !visited[i]) {
//                 dfs(i);
//             }
//         }
//     };

//     // Start DFS from the first node; modify to start from different nodes if needed
//     for (let i = 0; i < flatSlots.length; i++) {
//         if (!visited[i]) {
//             dfs(i);
//         }
//     }
//     return result;
// };  
// export const findMaxCliques = (slots: ClassTimeSlotType[]): ClassTimeSlotTypeUnion[] => {
//     const flatSlots = transformSlots(slots);
//     // Building the adjacency matrix
//     const adjacencyMatrix: number[][] = flatSlots.map(() => new Array(flatSlots.length).fill(0));
//     for (let i = 0; i < flatSlots.length; i++) {
//         for (let j = 0; j < flatSlots.length; j++) {
//             if (i !== j && !overlapUnion(flatSlots[i], flatSlots[j])) {
//                 adjacencyMatrix[i][j] = 1;  // Set connection if there is no overlap
//             }
//         }
//     }

//     // Log the adjacency matrix
//     console.log("Adjacency Matrix:");
//     console.log(adjacencyMatrix.map(row => `[${row.join(', ')}]`).join(',\n'));

//     // Find maximal cliques using the Bron-Kerbosch algorithm
//     let cliques: Set<number>[] = [];
//     bronKerbosch(new Set<number>(), new Set<number>(adjacencyMatrix.map((_, index) => index)), new Set<number>(), adjacencyMatrix, cliques);

//     // Transform cliques from indices to ClassTimeSlotTypeUnion arrays
//     const maximalCliques: ClassTimeSlotTypeUnion[][] = cliques.map(clique => Array.from(clique).map(index => flatSlots[index]));

//     return maximalCliques.flat();
// };

// function bronKerbosch(R: Set<number>, P: Set<number>, X: Set<number>, adjacencyMatrix: number[][], cliques: Set<number>[]): void {
//     if (P.size === 0 && X.size === 0) {
//         cliques.push(new Set(R));  // R is a maximal clique
//         return;
//     }

//     const PArray = Array.from(P);
//     for (let v of PArray) {
//         const neighbors = new Set<number>();
//         adjacencyMatrix[v].forEach((isEdge, index) => {
//             if (isEdge && index !== v) {
//                 neighbors.add(index);
//             }
//         });

//         bronKerbosch(new Set([...R, v]), new Set([...P].filter(x => neighbors.has(x))), 
//                      new Set([...X].filter(x => neighbors.has(x))), adjacencyMatrix, cliques);
//         P.delete(v);
//         X.add(v);
//     }
// }
  