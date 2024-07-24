import { BipartiteMatcher } from "./bipartiteMatcher";
import { ClassTimeSlotTypeUnion } from "../types/timetable";
interface TimeSlot {
    startTime: string;
    endTime: string;
    day: string;
  }
  
  
  const doesOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
    if (slot1.day !== slot2.day) return false;
  
    return (
      (slot1.startTime < slot2.endTime && slot1.startTime >= slot2.startTime) ||
      (slot2.startTime < slot1.endTime && slot2.startTime >= slot1.startTime)
    );
  };
  
  export const constructGraph = (timeSlots: ClassTimeSlotTypeUnion[]): { graph: Map<number, number[]>, slotMap: Map<number, TimeSlot>, classMap: Map<number, ClassTimeSlotTypeUnion> } => {
    const graph = new Map<number, number[]>();
    const slotMap = new Map<number, TimeSlot>();
    const classMap = new Map<number, ClassTimeSlotTypeUnion>();
  
    let slotIndex = 0;
  
    timeSlots.forEach((slot, index) => {
      for (let i = 0; i < slot.startTime.length; i++) {
        const currentSlot: TimeSlot = {
          startTime: slot.startTime[i],
          endTime: slot.endTime[i],
          day: slot.day[i],
        };
  
        slotMap.set(slotIndex, currentSlot);
        classMap.set(slotIndex, slot);
  
        if (!graph.has(slotIndex)) {
          graph.set(slotIndex, []);
        }
  
        timeSlots.forEach((otherSlot, otherIndex) => {
          if (index !== otherIndex) {
            for (let j = 0; j < otherSlot.startTime.length; j++) {
              const otherCurrentSlot: TimeSlot = {
                startTime: otherSlot.startTime[j],
                endTime: otherSlot.endTime[j],
                day: otherSlot.day[j],
              };
  
              if (!doesOverlap(currentSlot, otherCurrentSlot)) {
                graph.get(slotIndex)?.push(slotIndex + otherIndex + j + 1);
              }
            }
          }
        });
  
        slotIndex++;
      }
    });
  
    return { graph, slotMap, classMap };
  };
  
  export const findNonOverlappingSchedule = (timeSlots: ClassTimeSlotTypeUnion[]): ClassTimeSlotTypeUnion[] | null => {
    const { graph, slotMap, classMap } = constructGraph(timeSlots);
    const matcher = new BipartiteMatcher(graph);
    matcher.maxBipartiteMatching();
    const matches = matcher.getMatches();
  
    const selectedSlots: ClassTimeSlotTypeUnion[] = [];
  
    matches.forEach((v, u) => {
      if (u !== matcher.NIL && v !== matcher.NIL) {
        selectedSlots.push(classMap.get(u)!);
      }
    });
  
    return selectedSlots.length === timeSlots.length ? selectedSlots : null;
  };