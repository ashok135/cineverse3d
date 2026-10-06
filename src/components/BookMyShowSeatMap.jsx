import React from 'react'
import { SEAT_ROWS, ALL_SEATS } from '../data/cinemaData'

/*
  BookMyShowSeatMap:
  An authentic 2D seat layout inspired by the BookMyShow app.
  - Organized by tiers: BALCONY, PRIME (MIDDLE), CLASSIC (FRONT)
  - Curved screen bar at the bottom / top ("All eyes this way please!")
  - Distinct aisles (Seats 1-5 | Aisle | Seats 6-10)
  - Clear visual states: Available, Sold / Occupied, Selected, Confirmed
  - Lets user pick any available seat with instant 3D sync
  - Direct "Confirm & Experience First-Person Seat View" button
*/

export default function BookMyShowSeatMap({
  isOpen,
  onClose,
  selectedSeat,
  confirmedSeat,
  onSelectSeat,
  onConfirmAndSit,
}) {
  if (!isOpen) return null

  // Group seats by tier/section for BookMyShow presentation
  const sections = [
    {
      title: 'BALCONY SECTION',
      priceLabel: '₹350 - ₹400',
      badge: 'PREMIUM OVERVIEW',
      rows: ['J', 'I', 'H'],
    },
    {
      title: 'MIDDLE AUDITORIUM (PRIME)',
      priceLabel: '₹220 - ₹280',
      badge: 'BEST SOUND & SIGHT',
      rows: ['G', 'F', 'E', 'D'],
    },
    {
      title: 'FRONT SECTION (CLASSIC)',
      priceLabel: '₹150 - ₹180',
      badge: 'CLOSE SCREEN VIEW',
      rows: ['C', 'B', 'A'],
    },
  ]

  // Map for quick seat lookup
  const seatLookup = new Map(ALL_SEATS.map((s) => [s.id, s]))

  return (
    <div className="bms-modal-backdrop" onClick={onClose}>
      <div className="bms-layout-card" onClick={(e) => e.stopPropagation()}>
        {/* ── Top Header ── */}
        <div className="bms-header">
          <div className="bms-header-info">
            <span className="bms-tag">BOOKMYSHOW 2D SEAT MAP</span>
            <h2 className="bms-movie-title">INTERSTELLAR</h2>
            <p className="bms-meta">Auditorium 4 · English 2D · IMAX Laser · 9:30 PM</p>
          </div>
          <button className="bms-close-btn" onClick={onClose} title="Close 2D Map">
            ✕
          </button>
        </div>

        {/* ── Seat Grid Content ── */}
        <div className="bms-grid-scroll">
          {sections.map((sec, idx) => (
            <div key={idx} className="bms-section-group">
              <div className="bms-section-header">
                <div className="bms-section-title">
                  <strong>{sec.title}</strong>
                  <span className="bms-section-badge">{sec.badge}</span>
                </div>
                <div className="bms-section-price">{sec.priceLabel}</div>
              </div>

              <div className="bms-rows-container">
                {sec.rows.map((rowLetter) => {
                  return (
                    <div key={rowLetter} className="bms-row">
                      <span className="bms-row-letter">{rowLetter}</span>

                      {/* Left Block: Seats 1-5 */}
                      <div className="bms-seat-block">
                        {[1, 2, 3, 4, 5].map((num) => {
                          const seatId = `${rowLetter}${num}`
                          const seat = seatLookup.get(seatId)
                          if (!seat) return null

                          const isSelected = selectedSeat?.id === seatId
                          const isConfirmed = confirmedSeat?.id === seatId
                          const isOccupied = seat.isOccupied

                          let seatStateClass = 'available'
                          if (isOccupied) seatStateClass = 'occupied'
                          else if (isConfirmed) seatStateClass = 'confirmed'
                          else if (isSelected) seatStateClass = 'selected'

                          return (
                            <button
                              key={seatId}
                              className={`bms-seat-btn ${seatStateClass}`}
                              disabled={isOccupied}
                              onClick={() => onSelectSeat(seat)}
                              title={`Seat ${seatId} · ₹${seat.price} (${seatStateClass})`}
                            >
                              {num}
                            </button>
                          )
                        })}
                      </div>

                      {/* Center Aisle Spacer */}
                      <div className="bms-aisle-gap">
                        <span>AISLE</span>
                      </div>

                      {/* Right Block: Seats 6-10 */}
                      <div className="bms-seat-block">
                        {[6, 7, 8, 9, 10].map((num) => {
                          const seatId = `${rowLetter}${num}`
                          const seat = seatLookup.get(seatId)
                          if (!seat) return null

                          const isSelected = selectedSeat?.id === seatId
                          const isConfirmed = confirmedSeat?.id === seatId
                          const isOccupied = seat.isOccupied

                          let seatStateClass = 'available'
                          if (isOccupied) seatStateClass = 'occupied'
                          else if (isConfirmed) seatStateClass = 'confirmed'
                          else if (isSelected) seatStateClass = 'selected'

                          return (
                            <button
                              key={seatId}
                              className={`bms-seat-btn ${seatStateClass}`}
                              disabled={isOccupied}
                              onClick={() => onSelectSeat(seat)}
                              title={`Seat ${seatId} · ₹${seat.price} (${seatStateClass})`}
                            >
                              {num}
                            </button>
                          )
                        })}
                      </div>

                      <span className="bms-row-letter right">{rowLetter}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* ── Screen Graphic at the front (closer to Row A) ── */}
          <div className="bms-screen-container">
            <div className="bms-screen-curve"></div>
            <span className="bms-screen-text">All eyes this way please! (CINEMA SCREEN)</span>
          </div>
        </div>

        {/* ── Footer Bar ── */}
        <div className="bms-footer">
          {/* Legend */}
          <div className="bms-legend">
            <div className="bms-legend-item">
              <span className="bms-legend-box available"></span>
              <span>Available</span>
            </div>
            <div className="bms-legend-item">
              <span className="bms-legend-box occupied"></span>
              <span>Sold</span>
            </div>
            <div className="bms-legend-item">
              <span className="bms-legend-box selected"></span>
              <span>Selected</span>
            </div>
            <div className="bms-legend-item">
              <span className="bms-legend-box confirmed"></span>
              <span>Confirmed</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="bms-action-wrap">
            {selectedSeat ? (
              <div className="bms-selected-summary">
                <div className="bms-summary-text">
                  <span className="bms-seat-pill">{selectedSeat.id}</span>
                  <span>
                    {selectedSeat.section} Tier · <strong>₹{selectedSeat.price}</strong>
                  </span>
                </div>
                <button
                  className="bms-confirm-btn"
                  onClick={() => {
                    onConfirmAndSit(selectedSeat)
                  }}
                >
                  Confirm & Sit in Seat {selectedSeat.id} 🪑
                </button>
              </div>
            ) : (
              <div className="bms-no-seat-hint">
                Tap an available seat above to select it
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
