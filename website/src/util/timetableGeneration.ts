import { ClassTimeSlotTypeUnion } from "../types/timetable";

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

function logPartitionDetails(partition) {
    partition.forEach((row, rowIndex) => {
        console.log(`Partition ${rowIndex + 1}: size ${row.length}`);
        row.forEach(slot => {
            console.log(`Title: ${slot.title}, Lesson Type: ${slot.lessonType}, Class No: ${slot.classNo}, Day: ${slot.day}`);
        });
    });
}

const getKey = (slot: ClassTimeSlotTypeUnion): string => {
    const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
    // console.log(key); // Debugging: Log out the keys to check for duplicates
    return key;
}

const getPartialKey = (Slot: ClassTimeSlotTypeUnion): string => {
    return Slot.title+Slot.lessonType+Slot.classNo;
}

function overlapUnion(slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean {
    // if (!slot1 || !slot2) {
    //     console.error("One of the slots is undefined.", { slot1, slot2 });
    //     return false;
    // }
    console.log(JSON.stringify(slot1))
    console.log(JSON.stringify(slot2))
    for (const day1 of slot1.day) {
        for (const day2 of slot2.day) {
            if (day1 === day2) {
                for (let i = 0; i < slot1.startTime.length; i++) {
                    for (let j = 0; j < slot2.startTime.length; j++) {
                        const start1 = timeToMinutes(slot1.startTime[i]);
                        const end1 = timeToMinutes(slot1.endTime[i]);
                        const start2 = timeToMinutes(slot2.startTime[j]);
                        const end2 = timeToMinutes(slot2.endTime[j]);
                        if (!(end1 <= start2 || start1 >= end2)) {
                            console.log(`Overlap detected between slots: ${JSON.stringify(slot1)} and ${JSON.stringify(slot2)}`);
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

export const partition = (timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[][] => {
    const courses = new Map<string, ClassTimeSlotTypeUnion[]>();
    timeslots.forEach(slot => {
        const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
        if (!courses.has(title)) {
            courses.set(title, []);
        }
        courses.get(title)?.push(slot);
    });
    const partitions: ClassTimeSlotTypeUnion[][] = Array.from(courses.values());
    // console.log(JSON.stringify(partitions))
    return partitions;
}

export const indexMapping = (partitions: ClassTimeSlotTypeUnion[][]): number[][] => {
    return partitions.map(group => group.map((_, index) => index));
}

export const compatible = (slot: ClassTimeSlotTypeUnion, partialSolution: number[], partitions: ClassTimeSlotTypeUnion[][]): boolean => {
    if (partialSolution.length <= 0) {
    console.log('compatible')

        return true;
    }
    for (let i = 0; i < partialSolution.length; i++) {
        if (partialSolution[i] === -1) {
            console.log('no slot selected yet, skip')
            continue;
        }
        if (overlapUnion(slot, partitions[i][partialSolution[i]])) {
            return false;
        }
    }
    console.log('compatible')
    return true;
}

const slotMapping = (indices:number[], partitions:ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[] => {
    const res: ClassTimeSlotTypeUnion[] = new Array(indices.length);
    for (let i = 0; i < indices.length; i++) {
        if (indices[i] === -1) {
            console.log('no possible arrangement')
            return [];
        }
        res[i] = partitions[i][indices[i]]
    }
    return res;
}

/**
 * 1. form partition based on class type
 * 2. map partition to index map
 * 3. 
 * 
*/

export const solve = (timeSlots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
    const partitions: ClassTimeSlotTypeUnion[][] = partition(timeSlots);
    partitions.filter(partition => partition.length <= 10);
    const indices: number[][]= indexMapping(partitions);
    const SOLUTION_SIZE = indices.length;
    const partialSolution: number[] = new Array(SOLUTION_SIZE).fill(-1);
    let currIdx = 0;
    logPartitionDetails(partitions)
    while (currIdx < SOLUTION_SIZE) {
        if (currIdx < 0) {
            console.log('no possible arrangement')
            return [];
        }
        let idx:number = partialSolution[currIdx];
        let canProceed: boolean = false;
        console.log('current layer: ' + currIdx + '; current slot idx: ' + idx)
        for (let i = 0; i < partitions[currIdx].length; i++) {
            if (compatible(partitions[currIdx][i], partialSolution, partitions)) {
                console.log(i)
                idx = i;
                partialSolution[currIdx] = idx;
                canProceed = true;
                break;
            }
        }
        if (canProceed) {
            currIdx++;
        } else {
            partialSolution[currIdx] = 0;
            currIdx--;
        }
    }
    console.log(partialSolution)
    return slotMapping(partialSolution, partitions);
}