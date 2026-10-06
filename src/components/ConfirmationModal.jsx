import React from 'react'

export default function ConfirmationModal({
  confirmedSeat,
  movie,
  theater,
  showtime,
  onClose,
  onSitInSeat,
  onResetAll,
}) {
  if (!confirmedSeat) return null

  const title = movie?.title || 'INTERSTELLAR'
  const hall = theater?.hall || 'Auditorium 4 · IMAX Laser'
  const time = showtime || '9:30 PM'

  return (
    <div className="modal-backdrop">
      <div className="ticket-card">
        <div className="ticket-header">
          <div className="ticket-badge">E-TICKET CONFIRMED</div>
          <button className="modal-close" onClick={onClose} title="Close">×</button>
        </div>

        <div className="ticket-body">
          <h2 className="movie-title">{title}</h2>
          <p className="movie-meta">{hall} · Today {time}</p>

          <div className="ticket-seat-grid">
            <div className="grid-item">
              <span className="label">SEAT</span>
              <span className="val highlight">{confirmedSeat.id}</span>
            </div>
            <div className="grid-item">
              <span className="label">ROW</span>
              <span className="val">Row {confirmedSeat.row}</span>
            </div>
            <div className="grid-item">
              <span className="label">TIER</span>
              <span className="val">{confirmedSeat.section}</span>
            </div>
            <div className="grid-item">
              <span className="label">AMOUNT</span>
              <span className="val price">₹{confirmedSeat.price}</span>
            </div>
          </div>

          <div className="ticket-divider">
            <div className="cutout-left"></div>
            <div className="dash-line"></div>
            <div className="cutout-right"></div>
          </div>

          <div className="ticket-barcode-section">
            <div className="barcode-graphic"></div>
            <div className="barcode-num">TK-8947-2026-CINEMA</div>
          </div>
        </div>

        <div className="ticket-footer">
          <button
            className="done-btn"
            onClick={() => {
              onClose()
              if (onSitInSeat) onSitInSeat()
            }}
          >
            🪑 Take Your Seat & Watch Movie
          </button>
          <button className="secondary-btn" onClick={onResetAll}>
            Select Another Seat
          </button>
        </div>
      </div>
    </div>
  )
}
