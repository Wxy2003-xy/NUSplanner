import { flatMap, has } from 'lodash';
import { ClassTimeSlotTypeUnion, CleanClassTimeSlot, ClassTimeSlotType, ClassNo, Venue, EndTime } from '../types/timetable';

function transformSlots(slots: ClassTimeSlotType[]): ClassTimeSlotTypeUnion[] {
    const grouped = new Map<string, ClassTimeSlotTypeUnion>();

    slots.forEach(slot => {
        const partialKey = `${slot.title}${slot.lessonType}${slot.classNo}`;
        const existing = grouped.get(partialKey);

        if (existing) {
            existing.startTime.push(slot.startTime as string);
            existing.endTime.push(slot.endTime as string);
            existing.day.push(slot.day as string);
        } else {
            grouped.set(partialKey, {
                classNo: slot.classNo,
                title: slot.title,
                lessonType: slot.lessonType,
                startTime: [slot.startTime as string],
                endTime: [slot.endTime as string],
                weeks: slot.weeks,
                venue: slot.venue,
                day: [slot.day as string],
            });
        }
    });
    return Array.from(grouped.values());
}

export function transformAndMergeSlots(slots: ClassTimeSlotTypeUnion[]): CleanClassTimeSlot[] {
    const grouped = new Map<string, CleanClassTimeSlot>();
    slots.forEach(slot => {
        // Create a unique key for each slot based on the combinable attributes
        const key:string = `${slot.title}${slot.classNo}${slot.lessonType}${slot.startTime}${slot.endTime}${slot.day}`;
        const existing = grouped.get(key);
        if (existing) {
            existing.classNo?.push(slot.classNo as ClassNo);
            existing.venue?.push(slot.venue as string);
        } else {
            grouped.set(key, {
                key: key,
                classNo: [slot.classNo as ClassNo],
                title: slot.title,
                lessonType: slot.lessonType,
                startTime: slot.startTime as string[],
                endTime: slot.endTime as EndTime[],
                weeks: slot.weeks,
                venue: [slot.venue as string],
                day: slot.day,
            });
        }
    });
    return Array.from(grouped.values());
}

export const slotPreprocessing = (slots: ClassTimeSlotType[]): CleanClassTimeSlot[] => {
    return transformAndMergeSlots(transformSlots(slots));
}

const indexMapping = (partitions: CleanClassTimeSlot[][]): number[][] => {
    return partitions.map(group => group.map((_, index) => index));
}

const slotMapping = (indices:number[], partitions:CleanClassTimeSlot[][]): CleanClassTimeSlot[] => {
    const res: CleanClassTimeSlot[] = new Array(indices.length);
    for (let i = 0; i < indices.length; i++) {
        if (indices[i] === -1) {
            console.log('no possible arrangement')
            return [];
        }
        res[i] = partitions[i][indices[i]]
    }
    return res;
}

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) return false;
    
    const elementCount = new Map<T, number>();
    
    for (const element of arr1) {
      elementCount.set(element, (elementCount.get(element) || 0) + 1);
    }
    
    for (const element of arr2) {
      if (!elementCount.has(element)) return false;
      elementCount.set(element, elementCount.get(element) as number - 1);
      if (elementCount.get(element) === 0) {
        elementCount.delete(element);
      }
    }
    
    return elementCount.size === 0;
  }

  const timeToMinutes = (time: string): number => {
    const hours = parseInt(time.substring(0, 2));
    const minutes = parseInt(time.substring(2, 4));
    return hours * 60 + minutes;
};

export const overlap = (slot1: CleanClassTimeSlot, slot2: CleanClassTimeSlot): boolean => {
    console.log('start')
    console.log(JSON.stringify(slot1) + '|\n' + JSON.stringify(slot2))
    
    for (let i = 0; i < slot1.day.length; i++) {
        const day1 = slot1.day[i];
        const start1 = timeToMinutes(slot1.startTime[i]);
        const end1 = timeToMinutes(slot1.endTime[i]);
        let idx2 = 0;
        for (let j = 0; j < slot2.day.length; j++) {
            if (day1 === slot2.day[j]) {
                idx2 = j;
                break
            }
        }
        const start2 = timeToMinutes(slot2.startTime[idx2]);
        const end2 = timeToMinutes(slot2.endTime[idx2]);
        console.log('On day: ' + day1 + 'slot1: start: ' + start1 + ' end: ' + end1 + ' / slot2: start: ' + start2 + ' end: ' + end2)
        if (!(end1 <= start2 || start1 >= end2)) {
            return true; // Overlap found
        }
    }
    return false;
}

export const compatible = (slot: CleanClassTimeSlot, partialSolution: number[], partitions: CleanClassTimeSlot[][]): boolean => {
    if (partialSolution.length <= 0) {
    console.log('compatible')
        return true;
    }
    for (let i = 0; i < partialSolution.length; i++) {
        if (partialSolution[i] === -1) {
            console.log('no slot selected yet, skip')
            continue;
        }
        if (overlap(slot, partitions[i][partialSolution[i]])) {
            return false;
        }
    }
    console.log('compatible')
    return true;
}

const overlapMatrix = (row1:number,col1:number,row2:number,col2:number,mat:number[][]):boolean=> {
    return true;
}

const getKey = (slot: CleanClassTimeSlot):string => {
    return `${slot.title}${slot.classNo}${slot.lessonType}${slot.startTime}${slot.endTime}${slot.day}`;
}

export const backtrackingArrange = (timeSlots: CleanClassTimeSlot[]): CleanClassTimeSlot[] => {
    const flatIndexMap = new Map<string, number>();
    const adjacencyMatrix: number[][] = timeSlots.map(() => new Array(timeSlots.length).fill(0));
    for (let i = 0; i < timeSlots.length; i++) {
        flatIndexMap.set(getKey(timeSlots[i]), i);
        for (let j = 0; j < timeSlots.length; j++) {
            if (i !== j && !overlap(timeSlots[i], timeSlots[j])) {
                adjacencyMatrix[i][j] = 1;  // Set connection if there is no overlap
            }
        }
    }
    const groups = new Map<string, CleanClassTimeSlot[]>();
    timeSlots.forEach(slot => {
        const key = `${slot.title}${slot.lessonType}`;
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key)?.push(slot);
    });
    const partitions: CleanClassTimeSlot[][] = Array.from(groups.values());
    const indexMap: number[][] = indexMapping(partitions);
    const indexMapFlat = (row:number, col:number):number => {
        let res = 0;
        for (let i = 0; i < row - 1; i++) {
            res = res + indexMap[i].length;
        }
        return res + col;
    }
    const indexMapExpand = (flatIndex: number): {row: number, col: number} => {
        let accumulatedIndex = 0;
        for (let i = 0; i < indexMap.length; i++) {
            if (flatIndex < accumulatedIndex + indexMap[i].length) {
                return { row: i, col: flatIndex - accumulatedIndex };
            }
            accumulatedIndex += indexMap[i].length;
        }
        throw new Error("The flat index is out of the range of the index map.");
    }
    const overlapMatrix = (row1:number,col1:number,row2:number,col2:number):boolean=> {
        return true;
    }
    const SOLUTION_SIZE: number = partitions.length;
    const partialSolution: number[] = new Array(SOLUTION_SIZE).fill(0)
    let currIdx = 0;
    while (currIdx < SOLUTION_SIZE) {
        if (currIdx < 0) {
            console.log('no possible arrangement')
            return [];
        }
        let idx:number = partialSolution[currIdx];
        let canProceed: boolean = false;
        console.log('current layer: ' + currIdx + '; current slot idx: ' + idx)
        for (let i = 0; i < indexMap[currIdx].length; i++) {
            const newRow:number = currIdx;
            const newCol:number = i;
            const flatIdx:number = indexMapFlat(newRow,newCol);
            for (let j = 0; j <= currIdx; j++) {
                const jFlatIdx:number = 0
            }
        }
    }
    console.log(partialSolution)
    return slotMapping(partialSolution, partitions);
}

export const checkOverlap = (slots: CleanClassTimeSlot[]): boolean => {
    for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
            if (overlap(slots[i], slots[j])) {
                console.log(`Conflict detected between slots at indices ${i} and ${j}`);
                return true; // An overlap was found
            }
        }
    }
    return false; // No overlaps found
}



// if (currIdx < 0) {
//     console.log('no possible arrangement')
//     return [];
// }
// let idx:number = partialSolution[currIdx];
// let canProceed: boolean = false;
// console.log('current layer: ' + currIdx + '; current slot idx: ' + idx)
// for (let i = 0; i < partitions[currIdx].length; i++) {
//     if (compatible(partitions[currIdx][i], partialSolution, partitions)) {
//         console.log(i)
//         idx = i;
//         partialSolution[currIdx] = idx;
//         canProceed = true;
//         break;
//     }
// }
// if (canProceed) {
//     currIdx++;
// } else {
//     partialSolution[currIdx] = 0;
//     currIdx--;
// }