import React, { useState } from 'react'

/*
  TopRightSeatMapWidget:
  - Supports dynamic showtime seats array
  - Matches the reference image layout:
    - Tier labels with dividers
    - Two-digit numbered pills (01, 02...)
    - 3D trapezoidal cinema screen
  - Live seat selection, confirmation, and stand-up buttons
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
  const [isMinimized, setIsMinimized] = useState(false)

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
    <div className={`tr-seatmap-widget ${isMinimized ? 'minimized' : ''}`}>
      {/* Widget Header Bar */}
      <div className="tr-widget-header">
        <div className="tr-header-title">
          <span className="tr-dot"></span>
          <span>SEAT LAYOUT</span>
          <span className="tr-avail-count">({availableCount} Free)</span>
          {activeSeat && (
            <span className="tr-active-pill">
              {activeSeat.id}
            </span>
          )}
        </div>
        <button
          className="tr-min-btn"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? 'Expand Seat Map' : 'Minimize'}
        >
          {isMinimized ? '⤢ Expand' : '—'}
        </button>
      </div>

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
                Click any seat above or directly on 3D chair
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
