import { flatten } from "lodash";
import { ClassTimeSlotType, ClassTimeSlotTypeUnion } from "../types/timetable";

const timeToMinutes = (time: string): number => {
    const hours = parseInt(time.substring(0, 2));
    const minutes = parseInt(time.substring(2, 4));
    return hours * 60 + minutes;
};

const overlap = (slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean => {
    for (let i = 0; i < slot1.day.length; i++) {
        for (let j = 0; j < slot2.day.length; j++) {
            if (slot1.day[i] === slot2.day[j]) {
                const start1 = timeToMinutes(slot1.startTime[i]);
                const end1 = timeToMinutes(slot1.endTime[i]);
                const start2 = timeToMinutes(slot2.startTime[j]);
                const end2 = timeToMinutes(slot2.endTime[j]);
                if (!(end1 <= start2 || start1 >= end2)) {
                    return true; // Overlap found
                }
            }
        }
    }
    return false;
};

class timetableArrangement {
    private numOfSlots: number;
    private slotArray: ClassTimeSlotTypeUnion[];
    private flattenedSlotArray: ClassTimeSlotType[] | undefined;
    constructor(numOfSlots: number) {
        this.numOfSlots = numOfSlots;
        this.slotArray = new Array(numOfSlots);
    }

    public getArray(): ClassTimeSlotTypeUnion[] {
        return this.slotArray;
    }
    public checkOverlap(): boolean {
        for (let i = 0; i < this.slotArray.length; i++) {
            for (let j = i + 1; j < this.slotArray.length; j++) {
                if (overlap(this.slotArray[i], this.slotArray[j])) {
                    return true; // An overlap was found between two slots
                }
            }
        }
        return false; // No overlaps found
    }
    public flattenSlots(): ClassTimeSlotType[] {
        let flattenedSlots: ClassTimeSlotType[] = [];
        this.slotArray.forEach(slot => {
            if (slot.day.length !== slot.startTime.length || slot.day.length !== slot.endTime.length) {
                throw new Error("Inconsistent lengths in slot arrays");
            }
            for (let i = 0; i < slot.day.length; i++) {
                const flatSlot: ClassTimeSlotType = {
                    classNo: slot.classNo,
                    title: slot.title as string,
                    lessonType: slot.lessonType,
                    startTime: slot.startTime[i],
                    endTime: slot.endTime[i],
                    weeks: slot.weeks,
                    venue: slot.venue,
                    day: slot.day[i]
                };
                flattenedSlots.push(flatSlot);
            }
        });
        return flattenedSlots;
    }
}

export const partitionSlots = (timeslots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[][] => {
    const courses = new Map<string, ClassTimeSlotTypeUnion[]>();
    timeslots.forEach(slot => {
        const title = `${slot.title} ${slot.lessonType || 'undefined'}`;
        if (!courses.has(title)) {
            courses.set(title, []);
        }
        courses.get(title)?.push(slot);
    });
    const partitions: ClassTimeSlotTypeUnion[][] = Array.from(courses.values());
    partitions.sort((a, b) => a.length - b.length);
    return partitions;
}

export const indexMapping = (partitions: ClassTimeSlotTypeUnion[][]): number[][] => {
    return partitions.map(group => group.map((_, index) => index));
}
export const backMapping = (indices:number[], partitions:ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[] => {
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