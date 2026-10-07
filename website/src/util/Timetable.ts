import { ClassTimeSlotTypeUnion } from "../types/timetable";
import { overlap } from './arrangeWithUnionedSlots';
  /**
   * TimeTable class is responsible for managing the arrangement of class time slots.
   * It maintains a grid to track the availability of time slots for each day of the week.
   */
  export class TimeTable {
    private grid: Map<string, boolean[]>;
    private occupiedSlots: ClassTimeSlotTypeUnion[] = [];
    constructor() {
      this.grid = new Map();
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
        this.grid.set(day, new Array(36).fill(false)); 
      });
    }
    /**
     * Converts a time string (HHMM format) to an interval index.
     * @param time- The time string in HHMM format.
     * @returns The interval index corresponding to the given time.
     */
    private timeToIntervalIndex(time: string): number {
      const hours = parseInt(time.substring(0, 2));
      const minutes = parseInt(time.substring(2, 4));
      return (hours - 6) * 2 + Math.floor(minutes / 30);
    }
    /**
     * Generates an array of interval tokens for a given time range.
     * @param startTime - The start time string in HHMM format.
     * @param endTime - The end time string in HHMM format.
     * @returns An array of interval tokens representing the time range.
     */
    private generateTokens(startTime: string, endTime: string): number[] {
      const start = this.timeToIntervalIndex(startTime);
      const end = this.timeToIntervalIndex(endTime) + (parseInt(endTime.substring(2, 4)) % 30 === 0 ? 0 : 1);
      const tokens: number[] = [];
      for (let i = start; i < end; i++) {
        tokens.push(i);
      }
      return tokens;
    }
    /**
     * Checks if a given slot can be added to the timetable without conflicts.
     * @param slot - The class time slot to be added.
     * @returns True if the slot can be added, false otherwise.
     */
    public canAddSlot(slot: ClassTimeSlotTypeUnion): boolean {
      const candidate = { ...slot, classNo: [slot.classNo || ''], venue: [] };
      return this.occupiedSlots.every((occupied) => !overlap(
        candidate,
        { ...occupied, classNo: [occupied.classNo || ''], venue: [] },
      ));
    }
    /**
     * Adds a given slot to the timetable.
     * @param slot - The class time slot to be added.
     */
    public addSlot(slot: ClassTimeSlotTypeUnion): void {
      this.occupiedSlots.push(slot);
      this.markSlot(slot);
    }

    private markSlot(slot: ClassTimeSlotTypeUnion): void {
      for (let i = 0; i < slot.startTime.length; i++) {
        const day = slot.day[i];
        const tokens = this.generateTokens(slot.startTime[i], slot.endTime[i]);
        tokens.forEach(token => {
          this.grid.get(day)![token] = true;
        });
      }
    }
    /**
     * Removes a given slot from the timetable.
     * @param slot - The class time slot to be removed.
     */
    public removeSlot(slot: ClassTimeSlotTypeUnion): void {
      const index = this.occupiedSlots.lastIndexOf(slot);
      if (index !== -1) {
        this.occupiedSlots.splice(index, 1);
        this.grid.forEach((intervals) => intervals.fill(false));
        this.occupiedSlots.forEach((occupied) => this.markSlot(occupied));
      }
    }
    /**
     * Gets the available time slots for a given day.
     * @param day - The day for which available slots are to be retrieved.
     * @returns An array of available time slots in HH:MM format.
     */
    public getAvailableSlots(day: string): string[] {
      const intervals = this.grid.get(day);
      const availableSlots: string[] = [];
  
      if (intervals) {
        for (let i = 0; i < intervals.length; i++) {
          if (!intervals[i]) {
            const hours = Math.floor(i / 2) + 6;
            const minutes = (i % 2) * 30;
            availableSlots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
          }
        }
      }
  
      return availableSlots;
    }
    /**
     * Finds a valid arrangement of class time slots from given partitions.
     * @param partitions - An array of arrays containing class time slot partitions.
     * @returns An array of class time slots representing a valid arrangement, or null if no valid arrangement is found.
     */
    public findValidArrangement(partitions: ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[] | null {
      const result: ClassTimeSlotTypeUnion[] = [];
      
      const dfs = (index: number): boolean => {
        if (index === partitions.length) {
          return true;
        }
        
        for (const slot of partitions[index]) {
          if (this.canAddSlot(slot)) {
            this.addSlot(slot);
            result.push(slot);
  
            if (dfs(index + 1)) {
              return true;
            }
  
            this.removeSlot(slot);
            result.pop();
          }
        }
        return false; 
      }
      if (dfs(0)) {
        return result;
      }
      return null; 
    }
  }
