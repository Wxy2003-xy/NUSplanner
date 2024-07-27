// utils/loadVenues.js
import { venueData } from "../data/venues";
export const loadVenuesX = (roomName:string) => {
  console.log('Searching for:', roomName); 
  for (const key in venueData) {
    console.log(key)
    if (JSON.stringify(key) === roomName) {
      console.log('Found:', venueData[key].roomName); 
      return venueData[key].location.x;
    }
  }
  console.log('No venue found matching:', roomName); 
  return 0; 
};

export const loadVenuesY = (roomName:string) => {
  for (const key in venueData) {
    if (JSON.stringify(key) === roomName) {
      return venueData[key].location.y;
    }
  }
  return 0; 
};