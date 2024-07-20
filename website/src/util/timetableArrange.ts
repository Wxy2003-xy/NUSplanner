import { StartTime, EndTime, ClassTimeSlotType, ClassTimeSlotTypeUnion, ClassNo, Day, Weeks } from '../types/timetable';
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

export const overlapUnion = (slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean => {
    // Check each day in slot1 against each day in slot2
    if (!slot1 || !slot2) {
        return false
    }
    for (const day1 of slot1.day) {
        for (const day2 of slot2.day) {
            if (day1 === day2) {
                // Only check times if days are the same
                for (let i = 0; i < slot1.startTime.length; i++) {
                    for (let j = 0; j < slot2.startTime.length; j++) {
                        const start1 = timeToMinutes(slot1.startTime[i]);
                        const end1 = timeToMinutes(slot1.endTime[i]);
                        const start2 = timeToMinutes(slot2.startTime[j]);
                        const end2 = timeToMinutes(slot2.endTime[j]);
                        // Check for time overlap
                        if (!(end1 <= start2 || start1 >= end2)) {
                            return true; // Overlap found
                        }
                    }
                }
            }
        }
    }
    return false; // No overlap found
};
export const arrange = (timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] | null => {
    const courses = new Map<string, ClassTimeSlotTypeUnion[]>();
    // Organize timeslots by their course title
    timeslots.forEach(slot => {
        const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
        if (!courses.has(title)) {
            courses.set(title, []);
        }
        courses.get(title)?.push(slot);
    });

    const partitions: ClassTimeSlotTypeUnion[][] = Array.from(courses.values());
    const compatiblefromSlot = (partition: ClassTimeSlotTypeUnion[][], partialSolution: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
        const compatibleSet: ClassTimeSlotTypeUnion[] = [];
        partition.forEach(row => row.forEach(slot1 => {
            partialSolution.forEach(slot2 => {
                if (!overlapUnion(slot1, slot2)) {
                    compatibleSet.push(slot1);
                }
            })
        }))
        return compatibleSet;
    }

    const checkCompatible = (slot: ClassTimeSlotTypeUnion, partialSolution:ClassTimeSlotTypeUnion[]): boolean => {
        let res = true;
        partialSolution.forEach(s => {
            res = res && (!overlapUnion(s, slot));
        })
        if (slot.lessonType === "Lecture") {
            console.log(slot.title+slot.lessonType+slot.classNo+slot.day + '  ' + res)
        }
        return res;
    }

    function findAllSlotsByClassNo(slots:ClassTimeSlotTypeUnion[], classNo:string): ClassTimeSlotTypeUnion[] {
        return slots.filter(slot => slot.classNo === classNo);
    }
    const sameClassNo = (slot: ClassTimeSlotTypeUnion, row: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] => {
        const res: ClassTimeSlotTypeUnion[] = [];
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

    const dfsCliqueFinding = (partition: ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[] => {
        const slotTypes = partition.length;
        // logPartitionDetails(partition)
        const partialSolution: ClassTimeSlotTypeUnion[] = [];
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
