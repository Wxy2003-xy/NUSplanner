// utils/loadVenues.js
import { venueData } from "../data/venues";
export const loadVenuesX = (roomName:string) => {
  console.log('Searching for:', roomName); // Debug to see what is being searched
  for (const key in venueData) {
    console.log(key)
    if (JSON.stringify(key) === roomName) {
      console.log('Found:', venueData[key].roomName); // Debug to confirm match
      return venueData[key].location.x;
    }
  }
  console.log('No venue found matching:', roomName); // Debug to confirm no match
  return 0; // Return 0 if no matching venue is found
};

export const loadVenuesY = (roomName:string) => {
  for (const key in venueData) {
    if (JSON.stringify(key) === roomName) {
      return venueData[key].location.y;
    }
  }
  return 0; // Return 0 if no matching venue is found
};