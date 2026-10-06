// Shared cinema configuration and dynamic seat generator

export const SEAT_ROWS = [
  // BALCONY (Elevated, premium, furthest from screen)
  { name: 'J', z: 6.5,  y: 2.10, section: 'Balcony', tierName: 'BALCONY · RECLINER', price: 400 },
  { name: 'I', z: 5.0,  y: 1.75, section: 'Balcony', tierName: 'BALCONY · PRIME', price: 380 },
  { name: 'H', z: 3.5,  y: 1.40, section: 'Balcony', tierName: 'BALCONY · CLASSIC', price: 350 },

  // MIDDLE (Tiered middle auditorium)
  { name: 'G', z: -0.5, y: 0.90, section: 'Middle',  tierName: 'PRIME · ROW G', price: 280 },
  { name: 'F', z: -2.0, y: 0.65, section: 'Middle',  tierName: 'PRIME · ROW F', price: 280 },
  { name: 'E', z: -3.5, y: 0.40, section: 'Middle',  tierName: 'PRIME · ROW E', price: 250 },
  { name: 'D', z: -5.0, y: 0.15, section: 'Middle',  tierName: 'PRIME · ROW D', price: 220 },

  // FRONT (Closest to the big movie screen)
  { name: 'C', z: -7.5, y: 0.05, section: 'Front',   tierName: 'CLASSIC · ROW C', price: 180 },
  { name: 'B', z: -9.0, y: 0.0,  section: 'Front',   tierName: 'CLASSIC · ROW B', price: 150 },
  { name: 'A', z: -10.5,y: 0.0,  section: 'Front',   tierName: 'CLASSIC · ROW A', price: 150 },
]

export const SEATS_PER_ROW = 10
export const X_SPACING = 1.05

// Default occupied seats
export const DEFAULT_OCCUPIED_SEATS = [
  'J2', 'J3', 'J8',
  'I5', 'I6',
  'H1', 'H10',
  'G4', 'G5', 'G7',
  'F3', 'F8',
  'E5', 'E6',
  'D2', 'D9',
  'C4', 'C5',
  'A1', 'A10',
]

// Function to generate seats with dynamic occupancy list
export function createSeatsWithOccupancy(occupiedSeatIds = DEFAULT_OCCUPIED_SEATS) {
  const list = []
  const occupiedSet = new Set(occupiedSeatIds)

  SEAT_ROWS.forEach((rowObj) => {
    for (let num = 1; num <= SEATS_PER_ROW; num++) {
      const aisleOffset = num > 5 ? 0.35 : -0.35
      const x = (num - 5.5) * X_SPACING + aisleOffset
      const id = `${rowObj.name}${num}`
      list.push({
        id,
        row: rowObj.name,
        number: num,
        section: rowObj.section,
        tierName: rowObj.tierName,
        price: rowObj.price,
        position: [x, rowObj.y, rowObj.z],
        isOccupied: occupiedSet.has(id),
      })
    }
  })

  return list
}

// Fallback constant for backwards compatibility
export const ALL_SEATS = createSeatsWithOccupancy(DEFAULT_OCCUPIED_SEATS)
