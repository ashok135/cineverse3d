import React, { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import CinemaScene from './components/CinemaScene'
import TopRightSeatMapWidget from './components/TopRightSeatMapWidget'
import ConfirmationModal from './components/ConfirmationModal'
import MovieSelectorModal from './components/MovieSelectorModal'
import { TMDB_MOVIES, THEATERS, SHOWTIMES, generateShowtimeOccupiedSeats } from './services/movieApi'
import { createSeatsWithOccupancy } from './data/cinemaData'
import './App.css'

export default function App() {
  // Movie, Theater & Showtime State
  const [activeMovie, setActiveMovie] = useState(TMDB_MOVIES[0])
  const [activeTheater, setActiveTheater] = useState(THEATERS[0])
  const [activeShowtime, setActiveShowtime] = useState(SHOWTIMES[3])
  const [showMovieModal, setShowMovieModal] = useState(false)

  // Seat Selection State
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [confirmedSeat, setConfirmedSeat] = useState(null)
  const [isSittingView, setIsSittingView] = useState(false)
  const [isLightsOn, setIsLightsOn] = useState(true)
  const [showTicketModal, setShowTicketModal] = useState(false)

  // Dynamically compute occupied seats for active movie, theater & showtime
  const seats = useMemo(() => {
    const occupiedList = generateShowtimeOccupiedSeats(
      activeMovie.id,
      activeTheater.id,
      activeShowtime
    )
    return createSeatsWithOccupancy(occupiedList)
  }, [activeMovie.id, activeTheater.id, activeShowtime])

  // Select seat
  const handleSelectSeat = (seat) => {
    setSelectedSeat(seat)
  }

  // Confirm seat & enter sitting perspective immediately
  const handleConfirmAndSit = (seatToConfirm = selectedSeat) => {
    if (!seatToConfirm) return
    setSelectedSeat(seatToConfirm)
    setConfirmedSeat(seatToConfirm)
    setIsSittingView(true)
  }

  // Stand up / return to wide overview
  const handleExitSitting = () => {
    setIsSittingView(false)
  }

  // Handle Movie/Theater/Showtime Change
  const handleApplyMovieSelection = (newMovie, newTheater, newShowtime) => {
    setActiveMovie(newMovie)
    setActiveTheater(newTheater)
    setActiveShowtime(newShowtime)
    // Reset any previously selected seat since new show has its own layout occupancy
    setSelectedSeat(null)
    setConfirmedSeat(null)
    setIsSittingView(false)
  }

  // Reset all
  const handleResetAll = () => {
    setSelectedSeat(null)
    setConfirmedSeat(null)
    setIsSittingView(false)
    setShowTicketModal(false)
  }

  const activeSeat = confirmedSeat || selectedSeat

  return (
    <div className={`cinema-app ${isSittingView ? 'in-sitting-view' : ''}`}>
      {/* ── Top Header Navigation ── */}
      <header className="cinema-header">
        <div className="brand">
          <span className="brand-dot"></span>
          <span className="brand-title">CINEVERSE 3D</span>
        </div>

        {/* Clickable Movie & Showtime Badge */}
        <div
          className="movie-badge clickable"
          onClick={() => setShowMovieModal(true)}
          title="Click to change movie, multiplex, or showtime"
        >
          NOW PLAYING: <strong>{activeMovie.title}</strong> · {activeShowtime}
          <span className="badge-change-icon">▼</span>
        </div>

        <div className="header-actions">
          {/* Change Movie Button */}
          <button
            className="header-btn movie-change-btn"
            onClick={() => setShowMovieModal(true)}
            title="Choose movie, multiplex & showtimes"
          >
            🎬 Movies & Shows
          </button>

          {/* 💡 Lights ON / 🎬 Lights OFF Toggle Button */}
          <button
            className={`header-btn lights-toggle-btn ${isLightsOn ? 'lights-on' : 'lights-off'}`}
            onClick={() => setIsLightsOn(!isLightsOn)}
            title="Toggle Theater House Lights ON / OFF"
          >
            {isLightsOn ? '💡 Lights ON' : '🎬 Movie Mode (Dim)'}
          </button>

          {isSittingView ? (
            <button className="header-btn overview-btn" onClick={handleExitSitting}>
              🌐 Return to Overview
            </button>
          ) : activeSeat ? (
            <button
              className="header-btn sit-view-btn"
              onClick={() => handleConfirmAndSit(activeSeat)}
            >
              🪑 Sit in Seat {activeSeat.id}
            </button>
          ) : null}

          {confirmedSeat && (
            <button
              className="header-btn ticket-btn"
              onClick={() => setShowTicketModal(true)}
            >
              🎫 Ticket
            </button>
          )}
        </div>
      </header>

      {/* ── Screen Direction Indicator (Only in Overview Mode) ── */}
      {!isSittingView && (
        <div className="screen-indicator">
          <div className="screen-curve" style={{ borderColor: activeMovie.themeColor }}></div>
          <span>SCREEN (FRONT)</span>
        </div>
      )}

      {/* ── Full-Viewport 3D Canvas ── */}
      <div className="canvas-wrapper">
        <Canvas
          camera={{
            position: [0, 10, 14],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor(isLightsOn ? '#10131a' : '#08090c')
          }}
        >
          <CinemaScene
            movie={activeMovie}
            theater={activeTheater}
            showtime={activeShowtime}
            seats={seats}
            selectedSeat={selectedSeat}
            confirmedSeat={confirmedSeat}
            isSittingView={isSittingView}
            isLightsOn={isLightsOn}
            onSelectSeat={handleSelectSeat}
            onExitSitting={handleExitSitting}
          />
        </Canvas>
      </div>

      {/* ── Top-Right Seat Map Widget ── */}
      <TopRightSeatMapWidget
        seats={seats}
        movie={activeMovie}
        theater={activeTheater}
        showtime={activeShowtime}
        selectedSeat={selectedSeat}
        confirmedSeat={confirmedSeat}
        isSittingView={isSittingView}
        onSelectSeat={handleSelectSeat}
        onConfirmAndSit={handleConfirmAndSit}
        onExitSitting={handleExitSitting}
        onOpenTicket={() => setShowTicketModal(true)}
      />

      {/* ── Discreet Seated Status Pill ── */}
      {isSittingView && activeSeat && (
        <div className="sitting-mini-pill">
          <span className="live-pulse"></span>
          <span>
            Watching <strong>{activeMovie.title}</strong> from <strong>Seat {activeSeat.id}</strong> ({activeSeat.section} Tier)
          </span>
          <button className="pill-exit-btn" onClick={handleExitSitting}>
            Stand Up
          </button>
        </div>
      )}

      {/* ── Seat Color Legend & Lights Indicator ── */}
      {!isSittingView && (
        <div className="cinema-legend">
          <div className="legend-item">
            <span className="legend-swatch available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch occupied"></span>
            <span>Sold</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch selected"></span>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch confirmed"></span>
            <span>Confirmed</span>
          </div>
          <div className="legend-divider"></div>
          <button
            className="legend-lights-btn"
            onClick={() => setIsLightsOn(!isLightsOn)}
          >
            {isLightsOn ? '💡 Lights: ON' : '🎬 Lights: OFF'}
          </button>
        </div>
      )}

      {/* ── Movie & Showtime Selector Modal ── */}
      <MovieSelectorModal
        isOpen={showMovieModal}
        onClose={() => setShowMovieModal(false)}
        activeMovie={activeMovie}
        activeTheater={activeTheater}
        activeShowtime={activeShowtime}
        onApplySelection={handleApplyMovieSelection}
      />

      {/* ── Confirmation E-Ticket Modal ── */}
      {showTicketModal && (
        <ConfirmationModal
          confirmedSeat={confirmedSeat}
          movie={activeMovie}
          theater={activeTheater}
          showtime={activeShowtime}
          onClose={() => setShowTicketModal(false)}
          onSitInSeat={() => {
            setIsSittingView(true)
            setShowTicketModal(false)
          }}
          onResetAll={handleResetAll}
        />
      )}
    </div>
  )
}
