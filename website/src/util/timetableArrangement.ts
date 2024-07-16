import { StartTime, EndTime, ClassTimeSlotType, ClassNo, Day, Weeks } from '../types/timetable';
import { isEqual, partition } from 'lodash';
import { Clear } from '@mui/icons-material';
import { ClassificationType } from "typescript";

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const areSlotsEqual = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
    return slot1.classNo === slot2.classNo &&
           slot1.lessonType === slot2.lessonType &&
           slot1.title === slot2.title;
}

export const overlap = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
    if (slot1.day !== slot2.day) {
        return false;
    }
    if (!slot1.startTime || !slot1.endTime || !slot2.startTime || !slot2.endTime) {
        return false;
    }
    const start1 = timeToMinutes(slot1.startTime);
    const end1 = timeToMinutes(slot1.endTime);
    const start2 = timeToMinutes(slot2.startTime);
    const end2 = timeToMinutes(slot2.endTime);
    return !(end1 <= start2 || start1 >= end2);
};
export const arrange = (timeslots: ClassTimeSlotType[]): ClassTimeSlotType[] | null => {
    const courses = new Map<string, ClassTimeSlotType[]>();
    // Organize timeslots by their course title
    timeslots.forEach(slot => {
        const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
        if (!courses.has(title)) {
            courses.set(title, []);
        }
        courses.get(title)?.push(slot);
    });
    const isConnectedfromSlot = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
         return !overlap(slot1, slot2) && (slot1.title+slot1.lessonType !== slot2.title+slot2.lessonType);
    }

    const partitions: ClassTimeSlotType[][] = Array.from(courses.values());
    const compatiblefromSlot = (partition: ClassTimeSlotType[][], partialSolution: ClassTimeSlotType[]): ClassTimeSlotType[] => {
        const compatibleSet: ClassTimeSlotType[] = [];
        partition.forEach(row => row.forEach(slot1 => {
            partialSolution.forEach(slot2 => {
                if (isConnectedfromSlot(slot1, slot2)) {
                    compatibleSet.push(slot1);
                }
            })
        }))
        return compatibleSet;
    }

    const checkCompatible = (slot: ClassTimeSlotType, partialSolution:ClassTimeSlotType[]): boolean => {
        let res = true;
        partialSolution.forEach(s => {
            res = res && isConnectedfromSlot(s, slot);
        })
        if (slot.lessonType === "Lecture") {
            console.log(slot.title+slot.lessonType+slot.classNo+slot.day + '  ' + res)
        }
        return res;
    }

    function findAllSlotsByClassNo(slots:ClassTimeSlotType[], classNo:string): ClassTimeSlotType[] {
        return slots.filter(slot => slot.classNo === classNo);
    }
    const sameClassNo = (slot: ClassTimeSlotType, row: ClassTimeSlotType[]): ClassTimeSlotType[] => {
        const res: ClassTimeSlotType[] = [];
        const no = slot.classNo;
        row.forEach(s => {
            if (s.classNo === no) {
                res.push(s)
            }
        })
        return res;
    }

    function logPartitionDetails(partition) {
        partition.forEach((row, rowIndex) => {
            console.log(`Partition ${rowIndex + 1}:`);
            row.forEach(slot => {
                console.log(`Title: ${slot.title}, Lesson Type: ${slot.lessonType}, Class No: ${slot.classNo}, Day: ${slot.day}`);
            });
        });
    }
    function logRow(row) {
        console.log('result: ')
        row.forEach(slot => {
            console.log(`Title: ${slot.title}, Lesson Type: ${slot.lessonType}, Class No: ${slot.classNo}, Day: ${slot.day}`);
        });
    }

    const dfsCliqueFinding = (partition: ClassTimeSlotType[][]): ClassTimeSlotType[] => {
        const slotTypes = partition.length;
        // logPartitionDetails(partition)
        const partialSolution: ClassTimeSlotType[] = [];
        let currentTypeIndex = 0;
        let currentSlotIndex = 0;
        while (currentTypeIndex < slotTypes) {
            const partialSolutionSize = partialSolution.length;
            console.log('push (' + currentTypeIndex + ', ' + currentSlotIndex + ')')
            const sameNo = sameClassNo(partition[currentTypeIndex][currentSlotIndex], partition[currentTypeIndex]);
            sameNo.forEach(s => {
                partialSolution.push(s);
            })
            // partialSolution.push(partition[currentTypeIndex][currentSlotIndex]);
            for (let i = currentSlotIndex; i < partition[currentTypeIndex].length; i++) {
                if (checkCompatible(partition[currentTypeIndex][i], partialSolution)) {
                    const sameNo = sameClassNo(partition[currentTypeIndex][i], partition[currentTypeIndex]);
                    console.log(sameNo.length)
                    if (sameNo.length > 1) {
                        console.log(sameNo.length)
                        currentSlotIndex = i;
                        sameNo.forEach(s => {
                            partialSolution.push(s);
                        })
                        break;
                    }
                    currentSlotIndex = i;
                    console.log('added')
                    console.log('push (' + currentTypeIndex + ', ' + currentSlotIndex + ')')

                    partialSolution.push(partition[currentTypeIndex][i]);
                    break;
                }
            }
            if (partialSolution.length === partialSolutionSize) {       // no addition, backtrack
                const toRemove = partialSolution.pop();
                if (toRemove) {
                    partialSolution.filter(s => s.classNo !== toRemove.classNo)
                }
                currentTypeIndex--;
            } else {                                                    // success, proceed
                currentTypeIndex++;
                currentSlotIndex = 0;
            }
        }
        return partialSolution;
    }
    const res = dfsCliqueFinding(partitions)
    // logRow(res)
    return res
};
export type SlotType = string;
export type SlotKey = string;
// export const arrange = (SlotSet: ClassTimeSlotType[]): ClassTimeSlotType[] => {
//     // SlotSet: ClassTimeSlotType[]
//     const solution: ClassTimeSlotType[] = [];
//     // dictionary maps a unique string representation to a ClassTimeSlotType;
//     const getType = (Slot: ClassTimeSlotType): SlotType => {
//         return Slot.title+Slot.lessonType;
//     }
//     const getKey = (Slot: ClassTimeSlotType): SlotKey => {
//         return Slot.title+Slot.lessonType+Slot.classNo+Slot.day;
//     }
//     const dictionary = SlotSet.reduce((acc, slot) => {
//         const key = getKey(slot);  // Get key using the getKey function
//         if (!acc.has(key)) {
//             acc.set(key, slot);
//         }
//         return acc;
//     }, new Map<SlotKey, ClassTimeSlotType>());
    
//     const groupByTypes = SlotSet.reduce((acc, slot) => {
//         const type = getType(slot);  // Get type using the getType function
//         if (!acc[type]) {
//             acc[type] = [];
//         }
//         acc[type].push(getKey(slot));  // Store keys instead of slots
//         return acc;
//     }, {} as Record<SlotType, SlotKey[]>);
    
//     // Now, sort and flatten each group by the keys as in the dictionary
//     const sortedAndFlattenedGroups = Object.entries(groupByTypes).reduce((acc, [groupKey, slotKeys]) => {
//         slotKeys.sort();  // Optionally sort the keys alphabetically; adjust sorting criteria as needed
//         acc[groupKey] = slotKeys.map(key => dictionary.get(key)).filter(slot => slot !== undefined) as ClassTimeSlotType[];
//         return acc;
//     }, {} as Record<SlotType, ClassTimeSlotType[]>);
    
    
//     // If needed, you can create a single sorted list from all groups:
//     const allSortedSlots = Object.values(sortedAndFlattenedGroups).flat();

//     const keyToIndexMap = new Map<SlotKey, number>();
//         allSortedSlots.forEach((slot, index) => {
//         const key = getKey(slot);
//         keyToIndexMap.set(key, index);
//     });

//     const numOfSlots = allSortedSlots.length;

//     const adjMatrix = Array.from({length: numOfSlots}, () => new Array(numOfSlots).fill(0));
//     const isConnectedfromSlot = (slot1: ClassTimeSlotType, slot2: ClassTimeSlotType): boolean => {
//         return !overlap(slot1, slot2) && (slot1.title+slot1.lessonType !== slot2.title+slot2.lessonType);
//     }
//     const isConnected = (key1: string, key2: string): boolean => {
//         const slot1 = dictionary.get(key1);
//         const slot2 = dictionary.get(key2);
//         if (!slot1 || !slot2) return false;
//         return !overlap(slot1, slot2) && (slot1.title+slot1.lessonType !== slot2.title+slot2.lessonType);
//     }
//     // Fill the adjacency matrix
//     for (let i = 0; i < numOfSlots; i++) {
//         for (let j = i + 1; j < numOfSlots; j++) {
//             if (isConnectedfromSlot(allSortedSlots[i], allSortedSlots[j])) {
//                 adjMatrix[i][j] = 1;
//                 adjMatrix[j][i] = 1; // Because the matrix is symmetric
//             }
//         }
//     }

//     console.log("Adjacency Matrix:");
//     for (let i = 0; i < numOfSlots; i++) {
//         console.log(`Row ${i}: ${adjMatrix[i].join(' ')}`);
//     }
    

//     const compatiblefromSlot = (partition: ClassTimeSlotType[][], partialSolution: ClassTimeSlotType[]): ClassTimeSlotType[] => {
//         const compatibleSet: ClassTimeSlotType[] = [];
//         partition.forEach(row => row.forEach(slot1 => {
//             partialSolution.forEach(slot2 => {
//                 if (isConnectedfromSlot(slot1, slot2)) {
//                     compatibleSet.push(slot1);
//                 }
//             })
//         }))
//         return compatibleSet;
//     }

//     const findCompatibleFromRow = (rowInPartition: ClassTimeSlotType[], partialSolution: ClassTimeSlotType[]): ClassTimeSlotType[] => {
//         const res: ClassTimeSlotType[] = [];
//         rowInPartition.forEach(slot => {
//             partialSolution.forEach(existing => {
//                 if (isConnectedfromSlot(slot, existing)) {
//                     res.push(slot);
//                 }
//             })
//         })
//         return res;
//     }

//     const checkCompatible = (slot: ClassTimeSlotType, partialSolution:ClassTimeSlotType[]): boolean => {
//         let res = true;
//         partialSolution.forEach(s => {
//             res = res && isConnectedfromSlot(s, slot);
//         })
//         return res;
//     }

//     const recursiveCliqueFinding = (partition: ClassTimeSlotType[][]): ClassTimeSlotType[] => {
//         const slotTypes = partition.length;
//         const partialSolution: ClassTimeSlotType[] = [];
//         let currentTypeIndex = 0;
//         let currentSlotIndex = 0;
//         while (currentTypeIndex < slotTypes) {
//             const partialSolutionSize = partialSolution.length;
//             partialSolution.push(partition[currentTypeIndex][currentSlotIndex]);
//             for (let i = currentSlotIndex; i < partition[currentTypeIndex].length; i++) {
//                 if (checkCompatible(partition[currentTypeIndex][i], partialSolution)) {
//                     currentSlotIndex = i;
//                     partialSolution.push(partition[currentTypeIndex][i]);
//                     break;
//                 }
//             }
//             if (partialSolution.length === partialSolutionSize) {
//                 partialSolution.pop();
//                 currentTypeIndex--;
//             } else {
//                 currentTypeIndex++;
//                 currentSlotIndex = 0;
//             }
//         }
//         return partialSolution;
//     }

//     const compatible = (keysPartition: string[][], partialSolutionKeys: string[]): string[] => {
//         const compatibleKeys: string[] = [];
//         keysPartition.forEach(row => row.forEach(key1 => {
//             partialSolutionKeys.forEach(key2 => {
//                 if (isConnected(key1, key2)) {
//                     compatibleKeys.push(key1);
//                 }
//             })
//         }))
//         return compatibleKeys;
//     }

//     const adjacentSetfromSlot = (partition: ClassTimeSlotType[][], slot: ClassTimeSlotType): ClassTimeSlotType[] => {
//         const adjacent: ClassTimeSlotType[] = [];
//         partition.forEach(row => row.forEach(rowSlot => {
//             if (isConnectedfromSlot(rowSlot, slot)) {
//                 adjacent.push(rowSlot);
//             }
//         }))
//         return adjacent;
//     }

//     const adjacentSet = (keysPartition: string[][], key: string): string[] => {
//         const adjacentKeys: string[] = [];
//         keysPartition.forEach(row => row.forEach(rowKey => {
//             if (isConnected(rowKey, key)) {
//                 adjacentKeys.push(rowKey);
//             }
//         }))
//         return adjacentKeys;
//     }

//     const unionfromSlot = (subset1: ClassTimeSlotType[], subset2: ClassTimeSlotType[]): ClassTimeSlotType[] => {
//         const keyMap = new Map<string, ClassTimeSlotType>();
//         const getKey = (slot: ClassTimeSlotType) => `${slot.classNo}-${slot.lessonType}-${slot.title}`;
//         subset1.forEach(slot => {
//             keyMap.set(getKey(slot), slot);
//         });
//         subset2.forEach(slot => {
//             const key = getKey(slot);
//             if (!keyMap.has(key)) {
//                 keyMap.set(key, slot);
//             }
//         });
//         return Array.from(keyMap.values());
//     }

//     const union = (keys1: string[], keys2: string[]): string[] => {
//         const uniqueKeys = new Set<string>();
//         keys1.forEach(key => uniqueKeys.add(key));
//         keys2.forEach(key => {
//             if (!uniqueKeys.has(key)) {
//                 uniqueKeys.add(key);
//             }
//         });
//         return Array.from(uniqueKeys);
//     }
    
//     const intersectionfromSlot = (subset1: ClassTimeSlotType[], subset2: ClassTimeSlotType[]): ClassTimeSlotType[] => {
//         const map1 = new Map<string, ClassTimeSlotType>();
//         const result: ClassTimeSlotType[] = [];
//         const getKey = (slot: ClassTimeSlotType) => `${slot.classNo}-${slot.lessonType}-${slot.title}`;
//         subset1.forEach(slot => {
//             map1.set(getKey(slot), slot);
//         });
//         subset2.forEach(slot => {
//             const key = getKey(slot);
//             if (map1.has(key)) {
//                 result.push(slot);
//             }
//         });
//         return result;
//     }
//     const intersection = (keys1: string[], keys2: string[]): string[] => {
//         const set1 = new Set(keys1);
//         const result: string[] = [];
//         keys2.forEach(key => {
//             if (set1.has(key)) {
//                 result.push(key);
//             }
//         });
//         return result;
//     }
//     //return allSortedSlots;
//     return findClique(allSortedSlots, adjMatrix, numOfSlots);
// }
