import React from 'react'

export default function SittingViewHud({
  activeSeat,
  onExitSitting,
  onOpenTicket,
  onOpenBmsLayout,
}) {
  if (!activeSeat) return null

  const getPerspectiveDesc = (row) => {
    if (row === 'A' || row === 'B' || row === 'C') {
      return 'Front Row Perspective: Massive IMAX screen close right in front of you. Look up!'
    }
    if (row === 'H' || row === 'I' || row === 'J') {
      return 'Balcony Perspective: Elevated view looking down over all 9 rows towards the distant screen.'
    }
    return 'Prime Middle Perspective: Balanced eye-level view directly centered with the screen.'
  }

  return (
    <div className="sitting-hud-container">
      <div className="sitting-hud-card">
        <div className="sitting-hud-badge">
          <span className="live-pulse"></span>
          <span>FIRST-PERSON PERSPECTIVE</span>
        </div>

        <div className="sitting-hud-title">
          Sitting in <strong>Seat {activeSeat.id}</strong> ({activeSeat.section} Tier · Row {activeSeat.row})
        </div>

        <div className="sitting-hud-desc">
          {getPerspectiveDesc(activeSeat.row)}
        </div>

        <div className="sitting-hud-controls">
          <button className="hud-btn primary" onClick={onExitSitting}>
            ◀ Theater Overview
          </button>
          <button className="hud-btn secondary" onClick={onOpenBmsLayout}>
            🎟 2D Seat Map
          </button>
          <button className="hud-btn accent" onClick={onOpenTicket}>
            🎫 E-Ticket
          </button>
        </div>

        <div className="sitting-hud-hint">
          💡 Drag mouse to turn your head and look around the auditorium!
        </div>
      </div>
    </div>
  )
}
