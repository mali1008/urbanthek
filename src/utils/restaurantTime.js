// ================================
// RESTAURANT WORKING HOURS
// Urban Thek
// Open: 9:00 AM
// Close: 10:30 PM
// Timezone: Local (Frontend)
// ================================

export const OPEN_TIME = 9;
export const CLOSE_TIME = 22.5;

export function isRestaurantOpen() {
  const now = new Date();
  const currentTime =
    now.getHours() + now.getMinutes() / 60;

  return currentTime >= OPEN_TIME &&
         currentTime <= CLOSE_TIME;
}
