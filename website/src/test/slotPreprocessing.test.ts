import { ClassTimeSlotType, CleanClassTimeSlot } from "../types/timetable";
import { slotPreprocessing } from "../util/arrangeWithUnionedSlots";
describe('Overlap Function Tests', () => {
    const data: ClassTimeSlotType[] = [
        {"classNo":"10","startTime":"0900","endTime":"1000","weeks":[3,4,5,6,7,8,9,10,11,12,13],"venue":"COM1-0114","day":"Friday","lessonType":"Tutorial","title":"CS2100"},
        {"classNo":"19","startTime":"0900","endTime":"1000","weeks":[3,4,5,6,7,8,9,10,11,12,13],"venue":"COM1-0113","day":"Friday","lessonType":"Tutorial","title":"CS2100"},
        {"classNo":"1","startTime":"1400","endTime":"1600","weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13],"venue":"UTSRC-LT52","day":"Friday","lessonType":"Lecture","title":"MA2108"},
        {"classNo":"1","startTime":"1400","endTime":"1600","weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13],"venue":"UTSRC-LT52","day":"Tuesday","lessonType":"Lecture","title":"MA2108"},
    ]
    const res: CleanClassTimeSlot[] = [
        {"classNo":["10","19"],"startTime":["0900"],"endTime":["1000"],"weeks":[3,4,5,6,7,8,9,10,11,12,13],"venue":["COM1-0114","COM1-0113"],"day":["Friday"],"lessonType":"Tutorial","title":"CS2100"},
        {"classNo":["1"],"startTime":["1400","1400"],"endTime":["1600","1600"],"weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13],"venue":["UTSRC-LT52"],"day":["Friday", "Tuesday"],"lessonType":"Lecture","title":"MA2108"},
    ]
    test('consolidate: ', () => {
        expect(slotPreprocessing(data)).toStrictEqual(res);
    });
});