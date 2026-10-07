import { venueData } from "../data/venues";
export const loadVenuesX = (roomName:string) => {
  for (const key in venueData) {
    if (JSON.stringify(key) === roomName) {
      const venue = venueData[key as keyof typeof venueData];
      return 'location' in venue ? venue.location.x : 0;
    }
  }
  return 0; 
};

export const loadVenuesY = (roomName:string) => {
  for (const key in venueData) {
    if (JSON.stringify(key) === roomName) {
      const venue = venueData[key as keyof typeof venueData];
      return 'location' in venue ? venue.location.y : 0;
    }
  }
  return 0; 
};
