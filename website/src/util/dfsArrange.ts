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

const memoOverlap = new Map<string, boolean>();

function overlapWithMemoization(slot1: ClassTimeSlotTypeUnion, slot2: ClassTimeSlotTypeUnion): boolean {
    const key = `${slot1.classNo}-${slot2.classNo}`;
    if (memoOverlap.has(key)) return memoOverlap.get(key)!;

    const result = overlap(slot1, slot2);
    memoOverlap.set(key, result);
    return result;
}
export class TimetableArrangement {
    private numOfSlots: number;
    private slots: ClassTimeSlotTypeUnion[];
    private adjacencyMatrix: number[][];

    constructor(slots: ClassTimeSlotTypeUnion[]) {
        this.numOfSlots = slots.length;
        this.slots = slots;
        this.adjacencyMatrix = this.buildAdjacencyMatrix();
    }

    private buildAdjacencyMatrix(): number[][] {
        const matrix: number[][] = this.slots.map(() => new Array(this.numOfSlots).fill(0));
        for (let i = 0; i < this.numOfSlots; i++) {
            for (let j = 0; j < this.numOfSlots; j++) {
                if (i !== j && !overlapWithMemoization(this.slots[i], this.slots[j])) {
                    matrix[i][j] = 1;  // No overlap
                }
            }
        }
        return matrix;
    }

    public arrange(): ClassTimeSlotTypeUnion[] | null {
        const arrangement: ClassTimeSlotTypeUnion[] = new Array(this.numOfSlots);
        if (this.dfsArrange(0, arrangement)) {
            return arrangement;
        }
        return null;  // No valid arrangement found
    }

    private dfsArrange(index: number, arrangement: ClassTimeSlotTypeUnion[] | undefined[]): boolean {
        if (index === this.numOfSlots) {
            return true;  // All slots successfully arranged without overlap
        }

        for (let i = 0; i < this.numOfSlots; i++) {
            if (this.canPlace(index, i, arrangement as ClassTimeSlotTypeUnion[])) {
                arrangement[index] = this.slots[i];
                if (this.dfsArrange(index + 1, arrangement)) {
                    return true;
                }
                arrangement[index] = undefined;  // Backtrack
            }
        }
        return false;  // No position found for this slot
    }

    private canPlace(index: number, slotIndex: number, arrangement: ClassTimeSlotTypeUnion[]): boolean {
        for (let i = 0; i < index; i++) {
            if (arrangement[i] && this.adjacencyMatrix[slotIndex][this.slots.indexOf(arrangement[i])] === 0) {
                return false;  // Overlap detected
            }
        }
        return true;
    }
}
