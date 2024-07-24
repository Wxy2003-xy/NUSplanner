import { ClassTimeSlotTypeUnion } from "../types/timetable";

interface TimeSlot {
    startTime: string;
    endTime: string;
    day: string;
  }
  
  export interface ClassTimeSlotTypeUnion {
    classNo?: string;
    startTime: string[];
    endTime: string[];
    weeks?: string[];
    venue?: string;
    day: string[];
    lessonType?: string;
    title?: string;
  }
  
  export class TimeTable {
    private grid: Map<string, boolean[]>;
  
    constructor() {
      this.grid = new Map();
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
        this.grid.set(day, new Array(36).fill(false)); // 36 slots from 6am to 12pm
      });
    }
  
    private timeToIntervalIndex(time: string): number {
      const hours = parseInt(time.substring(0, 2));
      const minutes = parseInt(time.substring(2, 4));
      return (hours - 6) * 2 + Math.floor(minutes / 30);
    }
  
    private generateTokens(startTime: string, endTime: string): number[] {
      const start = this.timeToIntervalIndex(startTime);
      const end = this.timeToIntervalIndex(endTime);
      const tokens: number[] = [];
      for (let i = start; i < end; i++) {
        tokens.push(i);
      }
      return tokens;
    }
  
    public canAddSlot(slot: ClassTimeSlotTypeUnion): boolean {
      for (let i = 0; i < slot.startTime.length; i++) {
        const day = slot.day[i];
        const tokens = this.generateTokens(slot.startTime[i], slot.endTime[i]);
        if (tokens.some(token => this.grid.get(day)?.[token])) {
          return false; // Overlap detected
        }
      }
      return true;
    }
  
    public addSlot(slot: ClassTimeSlotTypeUnion): void {
      for (let i = 0; i < slot.startTime.length; i++) {
        const day = slot.day[i];
        const tokens = this.generateTokens(slot.startTime[i], slot.endTime[i]);
        tokens.forEach(token => {
          this.grid.get(day)![token] = true;
        });
      }
    }
  
    public removeSlot(slot: ClassTimeSlotTypeUnion): void {
      for (let i = 0; i < slot.startTime.length; i++) {
        const day = slot.day[i];
        const tokens = this.generateTokens(slot.startTime[i], slot.endTime[i]);
        tokens.forEach(token => {
          this.grid.get(day)![token] = false;
        });
      }
    }
  
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
  
    public findValidArrangement(partitions: ClassTimeSlotTypeUnion[][]): ClassTimeSlotTypeUnion[] | null {
      const result: ClassTimeSlotTypeUnion[] = [];
      
      const dfs = (index: number): boolean => {
        if (index === partitions.length) {
          return true; // All partitions have been successfully placed
        }
        
        for (const slot of partitions[index]) {
          if (this.canAddSlot(slot)) {
            this.addSlot(slot);
            result.push(slot);
  
            if (dfs(index + 1)) {
              return true;
            }
  
            // Prune: remove the slot and try the next one
            this.removeSlot(slot);
            result.pop();
          }
        }
        return false; // No valid arrangement found for this partition
      }
  
      if (dfs(0)) {
        return result;
      }
  
      return null; // No valid arrangement found
    }
  }