import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import CinemaScene from './components/CinemaScene'
import TopRightSeatMapWidget from './components/TopRightSeatMapWidget'
import ConfirmationModal from './components/ConfirmationModal'
import MovieSelectorModal from './components/MovieSelectorModal'
import { LOCAL_VIDEOS } from './components/Screen'
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

  // ── Video and Audio States for Movie Screen ──
  const [videoIndex, setVideoIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef(null)

  const currentVideo = LOCAL_VIDEOS[videoIndex % LOCAL_VIDEOS.length]

  const handleNextVideo = () => {
    setVideoIndex((prev) => (prev + 1) % LOCAL_VIDEOS.length)
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {})
      }
    }, 50)
  }

  const handleToggleSound = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    if (videoRef.current) {
      videoRef.current.muted = nextMuted
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {})
    }
  }

  // Ensure playback starts on first touch/click anywhere
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = isMuted
      video.play().then(() => setIsVideoPlaying(true)).catch(() => {
        // Fallback to muted auto-play
        video.muted = true
        video.play().then(() => setIsVideoPlaying(true)).catch(() => {})
      })
    }

    const startPlayOnGesture = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {})
      }
    }

    window.addEventListener('click', startPlayOnGesture)
    window.addEventListener('touchstart', startPlayOnGesture)
    return () => {
      window.removeEventListener('click', startPlayOnGesture)
      window.removeEventListener('touchstart', startPlayOnGesture)
    }
  }, [currentVideo.src])

  // Handle Movie/Theater/Showtime Change
  const handleApplyMovieSelection = (newMovie, newTheater, newShowtime) => {
    setActiveMovie(newMovie)
    setActiveTheater(newTheater)
    setActiveShowtime(newShowtime)
    setVideoIndex((prev) => (prev + 1) % LOCAL_VIDEOS.length)
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

        {/* Clickable Movie & Showtime Badge (Desktop) */}
        <div
          className="movie-badge desktop-only clickable"
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
            <span className="btn-icon">🎬</span>
            <span className="btn-text-full">Movies & Shows</span>
            <span className="btn-text-short">Shows</span>
          </button>

          {/* 🎲 Video Switcher Button */}
          <button
            className="header-btn video-switch-btn"
            onClick={handleNextVideo}
            title="Play next random movie trailer on 3D screen"
          >
            <span className="btn-icon">🎲</span>
            <span className="btn-text-full">Change Video</span>
            <span className="btn-text-short">Video</span>
          </button>

          {/* 🔊 / 🔇 Sound Toggle Button */}
          <button
            className={`header-btn sound-toggle-btn ${!isMuted ? 'sound-on' : ''}`}
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Theater Audio' : 'Mute Theater Audio'}
          >
            <span className="btn-icon">{isMuted ? '🔇' : '🔊'}</span>
            <span className="btn-text-full">{isMuted ? 'Audio Muted' : 'Sound ON'}</span>
            <span className="btn-text-short">{isMuted ? 'Mute' : 'Sound'}</span>
          </button>

          {/* 💡 Lights ON / 🎬 Lights OFF Toggle Button */}
          <button
            className={`header-btn lights-toggle-btn ${isLightsOn ? 'lights-on' : 'lights-off'}`}
            onClick={() => setIsLightsOn(!isLightsOn)}
            title="Toggle Theater House Lights ON / OFF"
          >
            <span className="btn-icon">{isLightsOn ? '💡' : '🎬'}</span>
            <span className="btn-text-full">{isLightsOn ? 'Lights ON' : 'Movie Mode (Dim)'}</span>
            <span className="btn-text-short">{isLightsOn ? 'Lights' : 'Dim'}</span>
          </button>

          {isSittingView ? (
            <button className="header-btn overview-btn" onClick={handleExitSitting}>
              <span className="btn-icon">🌐</span>
              <span className="btn-text-full">Return to Overview</span>
              <span className="btn-text-short">Overview</span>
            </button>
          ) : activeSeat ? (
            <button
              className="header-btn sit-view-btn"
              onClick={() => handleConfirmAndSit(activeSeat)}
            >
              <span className="btn-icon">🪑</span>
              <span className="btn-text-full">Sit in Seat {activeSeat.id}</span>
              <span className="btn-text-short">Sit {activeSeat.id}</span>
            </button>
          ) : null}

          {confirmedSeat && (
            <button
              className="header-btn ticket-btn"
              onClick={() => setShowTicketModal(true)}
            >
              <span className="btn-icon">🎫</span>
              <span className="btn-text-full">Ticket</span>
              <span className="btn-text-short">Ticket</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Mobile Movie & Showtime Chip (Only on Mobile) ── */}
      <div
        className="mobile-movie-chip"
        onClick={() => setShowMovieModal(true)}
        title="Tap to change movie, multiplex, or showtime"
      >
        <span className="mm-dot"></span>
        <span className="mm-title">{activeMovie.title}</span>
        <span className="mm-sep">·</span>
        <span className="mm-time">{activeShowtime}</span>
        <span className="mm-arrow">▼</span>
      </div>

      {/* ── Screen Direction Indicator (Only in Overview Mode) ── */}
      {!isSittingView && (
        <div className="screen-indicator">
          <div className="screen-curve" style={{ borderColor: activeMovie.themeColor }}></div>
          <span>SCREEN (FRONT)</span>
        </div>
      )}

      {/* ── Native HTML5 Video Element for 3D VideoTexture Projection ── */}
      <video
        ref={videoRef}
        id="cinema-active-video"
        src={currentVideo.src}
        loop
        playsInline
        muted={isMuted}
        autoPlay
        crossOrigin="anonymous"
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          opacity: 0.01,
          pointerEvents: 'none',
          zIndex: -999,
        }}
      />

      {/* ── Tap to Play Overlay (if browser blocked auto-play) ── */}
      {!isVideoPlaying && (
        <button
          className="play-video-overlay-btn"
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {})
            }
          }}
          title="Start video projection"
        >
          ▶ Tap to Start Video
        </button>
      )}

      {/* ── Full-Viewport 3D Canvas ── */}
      <div className="canvas-wrapper">
        <Canvas
          camera={{
            position: [0, 7.5, 10.5],
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
            videoIndex={videoIndex}
            videoElement={videoRef.current}
            isMuted={isMuted}
            onNextVideo={handleNextVideo}
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
