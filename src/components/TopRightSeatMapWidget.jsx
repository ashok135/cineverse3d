import React, { useState, useEffect } from 'react'

/*
  TopRightSeatMapWidget:
  - Responsive on both Desktop and Mobile devices
  - Desktop: Floats in top-right corner
  - Mobile (< 768px): Acts as a bottom sheet / drawer
    * Starts as a compact bottom bar showing available count and selected seat
    * Expands smoothly to show full seat map and trapezoid screen plate
    * One-tap 'Confirm & Sit' thumb action
*/

export default function TopRightSeatMapWidget({
  seats = [],
  movie,
  theater,
  showtime,
  selectedSeat,
  confirmedSeat,
  isSittingView,
  onSelectSeat,
  onConfirmAndSit,
  onExitSitting,
  onOpenTicket,
}) {
  // Start minimized on mobile so 3D scene is visible
  const [isMinimized, setIsMinimized] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })

  // Auto-expand when a seat is clicked in 3D so user can see details
  useEffect(() => {
    if (selectedSeat && typeof window !== 'undefined' && window.innerWidth < 768) {
      // Keep compact or show bottom action
    }
  }, [selectedSeat])

  // Map for fast seat lookup
  const seatLookup = new Map(seats.map((s) => [s.id, s]))

  // 3 Tiers for the widget
  const tiers = [
    {
      label: '₹400 ROYAL BALCONY',
      rows: ['J', 'I', 'H'],
    },
    {
      label: '₹280 PRIME RECLINERS',
      rows: ['G', 'F', 'E', 'D'],
    },
    {
      label: '₹150 CLASSIC FRONT',
      rows: ['C', 'B', 'A'],
    },
  ]

  const activeSeat = confirmedSeat || selectedSeat

  // Count available seats
  const availableCount = seats.filter((s) => !s.isOccupied).length

  return (
    <div className={`tr-seatmap-widget ${isMinimized ? 'minimized' : 'expanded'}`}>
      {/* Mobile Drawer Pull Handle Indicator */}
      <div className="tr-drag-handle" onClick={() => setIsMinimized(!isMinimized)}>
        <span className="tr-handle-bar"></span>
      </div>

      {/* ── Desktop & Expanded Header ── */}
      {(!isMinimized || typeof window === 'undefined' || window.innerWidth >= 768) && (
        <div className="tr-widget-header" onClick={() => setIsMinimized(!isMinimized)}>
          <div className="tr-header-title">
            <span className="tr-dot"></span>
            <span className="tr-title-text">SEAT MAP</span>
            <span className="tr-avail-count">({availableCount} Free)</span>
            {activeSeat && (
              <span className="tr-active-pill">
                {activeSeat.id}
              </span>
            )}
          </div>
          <button
            className="tr-min-btn"
            onClick={(e) => {
              e.stopPropagation()
              setIsMinimized(!isMinimized)
            }}
            title={isMinimized ? 'Expand Seat Map' : 'Minimize'}
          >
            {isMinimized ? '⤢ View Map' : '✕ Close'}
          </button>
        </div>
      )}

      {/* ── Mobile Minimized Single Floating Bar (Unified 1-Row Card) ── */}
      {isMinimized && (
        <div className="tr-mobile-single-bar" onClick={() => setIsMinimized(false)}>
          {selectedSeat ? (
            /* State A: A seat is selected */
            <div className="tr-msb-content has-selection">
              <div className="tr-msb-seat-info">
                <span className="tr-msb-badge">{selectedSeat.id}</span>
                <div className="tr-msb-text">
                  <span className="tr-msb-price">₹{selectedSeat.price}</span>
                  <span className="tr-msb-row">Row {selectedSeat.row} · {selectedSeat.section}</span>
                </div>
              </div>
              <div className="tr-msb-actions">
                <button
                  className="tr-msb-map-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMinimized(false)
                  }}
                  title="Open Seat Map"
                >
                  ⤢ Map
                </button>
                <button
                  className="tr-msb-confirm-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onConfirmAndSit(selectedSeat)
                  }}
                >
                  Confirm & Sit 🪑
                </button>
              </div>
            </div>
          ) : (
            /* State B: No seat selected yet */
            <div className="tr-msb-content empty">
              <div className="tr-msb-avail-info">
                <span className="tr-msb-dot"></span>
                <div className="tr-msb-text">
                  <span className="tr-msb-count-text">{availableCount} Seats Free</span>
                  <span className="tr-msb-hint">Tap any 3D chair or map</span>
                </div>
              </div>
              <button
                className="tr-msb-open-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized(false)
                }}
              >
                ⤢ View Seat Map
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expanded Body */}
      {!isMinimized && (
        <div className="tr-widget-body">
          {/* Movie & Showtime quick info banner */}
          <div className="tr-show-banner">
            <span className="tr-banner-movie">{movie?.title || 'INTERSTELLAR'}</span>
            <span className="tr-banner-time">· {showtime || '9:30 PM'}</span>
          </div>

          {/* Seat Tiers Grid */}
          <div className="tr-tiers-scroll">
            {tiers.map((tier, tIdx) => (
              <div key={tIdx} className="tr-tier-group">
                {/* Section Header */}
                <div className="tr-tier-title">{tier.label}</div>
                <div className="tr-tier-divider"></div>

                {/* Rows inside tier */}
                <div className="tr-tier-rows">
                  {tier.rows.map((rowLetter) => (
                    <div key={rowLetter} className="tr-row">
                      <span className="tr-row-tag">{rowLetter}</span>

                      {/* Left Block: Seats 01 - 05 */}
                      <div className="tr-seats-group">
                        {[1, 2, 3, 4, 5].map((num) => {
                          const seatId = `${rowLetter}${num}`
                          const seat = seatLookup.get(seatId)
                          if (!seat) return null

                          const isSelected = selectedSeat?.id === seatId
                          const isConfirmed = confirmedSeat?.id === seatId
                          const isOccupied = seat.isOccupied

                          let statusClass = 'available'
                          if (isOccupied) statusClass = 'occupied'
                          else if (isConfirmed) statusClass = 'confirmed'
                          else if (isSelected) statusClass = 'selected'

                          const formattedNum = String(num).padStart(2, '0')

                          return (
                            <button
                              key={seatId}
                              className={`tr-seat-pill ${statusClass}`}
                              disabled={isOccupied}
                              onClick={() => onSelectSeat(seat)}
                              title={`Seat ${seatId} · ₹${seat.price} (${statusClass})`}
                            >
                              {formattedNum}
                            </button>
                          )
                        })}
                      </div>

                      {/* Aisle Space */}
                      <div className="tr-aisle-spacer"></div>

                      {/* Right Block: Seats 06 - 10 */}
                      <div className="tr-seats-group">
                        {[6, 7, 8, 9, 10].map((num) => {
                          const seatId = `${rowLetter}${num}`
                          const seat = seatLookup.get(seatId)
                          if (!seat) return null

                          const isSelected = selectedSeat?.id === seatId
                          const isConfirmed = confirmedSeat?.id === seatId
                          const isOccupied = seat.isOccupied

                          let statusClass = 'available'
                          if (isOccupied) statusClass = 'occupied'
                          else if (isConfirmed) statusClass = 'confirmed'
                          else if (isSelected) statusClass = 'selected'

                          const formattedNum = String(num).padStart(2, '0')

                          return (
                            <button
                              key={seatId}
                              className={`tr-seat-pill ${statusClass}`}
                              disabled={isOccupied}
                              onClick={() => onSelectSeat(seat)}
                              title={`Seat ${seatId} · ₹${seat.price} (${statusClass})`}
                            >
                              {formattedNum}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* 3D Trapezoidal Movie Screen at the bottom */}
            <div className="tr-screen-plate-wrap">
              <div className="tr-screen-plate">
                <span>CINEMA SCREEN</span>
              </div>
            </div>
          </div>

          {/* Widget Footer & Actions */}
          <div className="tr-widget-footer">
            {selectedSeat ? (
              <div className="tr-selection-footer">
                <div className="tr-selected-info">
                  <span className="tr-seat-badge">{selectedSeat.id}</span>
                  <div className="tr-text-group">
                    <span className="tr-row-info">
                      Row {selectedSeat.row} · {selectedSeat.section} Tier
                    </span>
                    <span className="tr-price-info">₹{selectedSeat.price}</span>
                  </div>
                </div>

                {isSittingView && confirmedSeat?.id === selectedSeat?.id ? (
                  <div className="tr-btn-row">
                    <button className="tr-action-btn overview" onClick={onExitSitting}>
                      🌐 Stand Up (Overview)
                    </button>
                    <button className="tr-action-btn ticket" onClick={onOpenTicket}>
                      🎫 Ticket
                    </button>
                  </div>
                ) : (
                  <button
                    className="tr-action-btn confirm"
                    onClick={() => onConfirmAndSit(selectedSeat)}
                  >
                    Confirm & Sit in Seat {selectedSeat.id} 🪑
                  </button>
                )}
              </div>
            ) : (
              <div className="tr-empty-hint">
                Tap any seat above or directly on 3D chair
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
