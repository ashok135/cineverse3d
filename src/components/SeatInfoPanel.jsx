import React from 'react'

export default function SeatInfoPanel({
  selectedSeat,
  isConfirmed,
  isSittingView,
  onConfirm,
  onEnterSitting,
  onExitSitting,
  onDeselect,
  onOpenTicket,
}) {
  if (!selectedSeat) return null

  return (
    <div className="seat-panel">
      <div className="panel-header">
        <div className="badge-tag">{selectedSeat.section} Tier</div>
        <button
          className="close-btn"
          onClick={onDeselect}
          title="Deselect Seat"
        >
          ×
        </button>
      </div>

      <div className="seat-display">
        <div className="seat-code">{selectedSeat.id}</div>
        <div className="seat-status">
          {isConfirmed ? (
            <span className="status-confirmed">● Confirmed</span>
          ) : (
            <span className="status-selected">● Selected</span>
          )}
        </div>
      </div>

      <div className="panel-details">
        <div className="detail-row">
          <span>Row</span>
          <strong>Row {selectedSeat.row}</strong>
        </div>
        <div className="detail-row">
          <span>Seat Number</span>
          <strong>Seat {selectedSeat.number}</strong>
        </div>
        <div className="detail-row">
          <span>Category</span>
          <strong>{selectedSeat.tierName || selectedSeat.section}</strong>
        </div>
        <div className="detail-row">
          <span>Ticket Price</span>
          <strong className="price-tag">₹{selectedSeat.price}</strong>
        </div>
      </div>

      {/* Perspective Note based on row */}
      <div className="panel-perspective-note">
        {selectedSeat.row === 'A' || selectedSeat.row === 'B' || selectedSeat.row === 'C' ? (
          <span>⚡ <strong>Front Row:</strong> Screen towers close right in front of you.</span>
        ) : selectedSeat.row === 'H' || selectedSeat.row === 'I' || selectedSeat.row === 'J' ? (
          <span>👑 <strong>Balcony:</strong> High vantage point looking down over all seats.</span>
        ) : (
          <span>★ <strong>Prime Middle:</strong> Perfect central angle and distance to screen.</span>
        )}
      </div>

      <div className="panel-actions">
        {isConfirmed ? (
          <div className="confirmed-actions">
            <div className="confirmed-note">✓ Booked & Confirmed</div>
            {isSittingView ? (
              <button className="stand-btn" onClick={onExitSitting}>
                🌐 Stand Up (Overview)
              </button>
            ) : (
              <button className="sit-btn" onClick={onEnterSitting}>
                🪑 Sit in Seat {selectedSeat.id}
              </button>
            )}
            <button className="ticket-link-btn" onClick={onOpenTicket}>
              🎫 View E-Ticket
            </button>
          </div>
        ) : (
          <div className="selection-actions">
            <button className="confirm-btn" onClick={onConfirm}>
              Confirm & Sit in Seat {selectedSeat.id} 🪑
            </button>
            {!isSittingView && (
              <button className="preview-btn" onClick={onEnterSitting}>
                👁 Preview Seat Perspective
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
