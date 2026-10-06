import React, { useState } from 'react'
import { TMDB_MOVIES, THEATERS, SHOWTIMES, fetchLiveTMDBNowPlaying } from '../services/movieApi'

/*
  MovieSelectorModal:
  BookMyShow-style multi-movie, theater, and showtime switcher.
  - Browse verified TMDB blockbuster movies with official posters and ratings
  - Option to enter a free TMDB API key to fetch live trending theatrical movies
  - Select different multiplexes (PVR IMAX Laser, Cinepolis Dolby Cinema, Director's Cut)
  - Select showtimes with dynamic seat occupancy matrices
*/

export default function MovieSelectorModal({
  isOpen,
  onClose,
  activeMovie,
  activeTheater,
  activeShowtime,
  onApplySelection,
}) {
  const [moviesList, setMoviesList] = useState(TMDB_MOVIES)
  const [selectedMovie, setSelectedMovie] = useState(activeMovie || TMDB_MOVIES[0])
  const [selectedTheater, setSelectedTheater] = useState(activeTheater || THEATERS[0])
  const [selectedShowtime, setSelectedShowtime] = useState(activeShowtime || SHOWTIMES[3])
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [isFetchingLive, setIsFetchingLive] = useState(false)
  const [apiStatusMsg, setApiStatusMsg] = useState('')

  if (!isOpen) return null

  // Fetch live TMDB releases with user API key
  const handleFetchLiveTMDB = async () => {
    if (!apiKeyInput.trim()) return
    setIsFetchingLive(true)
    setApiStatusMsg('Connecting to TMDB API...')

    const liveMovies = await fetchLiveTMDBNowPlaying(apiKeyInput.trim())
    setIsFetchingLive(false)

    if (liveMovies && liveMovies.length > 0) {
      setMoviesList(liveMovies)
      setSelectedMovie(liveMovies[0])
      setApiStatusMsg(`✓ Fetched ${liveMovies.length} live movies from TMDB!`)
    } else {
      setApiStatusMsg('⚠️ Could not connect with this key. Using verified TMDB lineup.')
    }
  }

  const handleConfirm = () => {
    onApplySelection(selectedMovie, selectedTheater, selectedShowtime)
    onClose()
  }

  return (
    <div className="movie-modal-backdrop" onClick={onClose}>
      <div className="movie-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="movie-modal-header">
          <div>
            <span className="bms-tag">BOOKMYSHOW CINEMA SELECTOR</span>
            <h2 className="movie-modal-title">CHOOSE MOVIE & AUDITORIUM</h2>
            <p className="movie-modal-subtitle">
              Select your film, multiplex experience, and showtime
            </p>
          </div>
          <button className="movie-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="movie-modal-body">
          {/* TMDB API Key Option */}
          <div className="tmdb-key-bar">
            <input
              type="text"
              placeholder="Optional: Paste free TMDB API Key to fetch live releases"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="tmdb-key-input"
            />
            <button
              className="tmdb-fetch-btn"
              onClick={handleFetchLiveTMDB}
              disabled={isFetchingLive || !apiKeyInput.trim()}
            >
              {isFetchingLive ? 'Fetching...' : 'Fetch Live TMDB'}
            </button>
            {apiStatusMsg && <span className="tmdb-status">{apiStatusMsg}</span>}
          </div>

          {/* 1. Movie Carousel / Grid */}
          <div className="movie-selection-section">
            <label className="section-label">1. SELECT MOVIE (TMDB CATALOGUE)</label>
            <div className="movie-cards-grid">
              {moviesList.map((movie) => {
                const isSelected = selectedMovie.id === movie.id
                return (
                  <div
                    key={movie.id}
                    className={`movie-card-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <div className="movie-poster-wrap">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="movie-poster-img"
                        loading="lazy"
                      />
                      <span className="movie-rating-badge">★ {movie.rating}</span>
                      <span className="movie-cert-badge">{movie.certification}</span>
                    </div>
                    <div className="movie-card-info">
                      <h4 className="movie-card-title">{movie.title}</h4>
                      <div className="movie-card-meta">
                        <span>{movie.releaseYear}</span>
                        <span>·</span>
                        <span>{movie.runtime}</span>
                      </div>
                      <span className="movie-card-format">{movie.format}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 2. Multiplex Cinema Experience */}
          <div className="theater-selection-section">
            <label className="section-label">2. SELECT MULTIPLEX AUDITORIUM</label>
            <div className="theaters-grid">
              {THEATERS.map((t) => {
                const isSelected = selectedTheater.id === t.id
                return (
                  <div
                    key={t.id}
                    className={`theater-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedTheater(t)}
                  >
                    <div className="theater-name">{t.name}</div>
                    <div className="theater-hall">{t.hall}</div>
                    <div className="theater-loc">{t.location}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. Showtime Selector */}
          <div className="showtime-selection-section">
            <label className="section-label">3. SELECT SHOWTIME (TODAY)</label>
            <div className="showtimes-wrap">
              {SHOWTIMES.map((time) => {
                const isSelected = selectedShowtime === time
                return (
                  <button
                    key={time}
                    className={`showtime-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedShowtime(time)}
                  >
                    <span className="time-val">{time}</span>
                    <span className="format-val">{selectedMovie.format.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="movie-modal-footer">
          <div className="footer-summary">
            <span>Now Selecting:</span>
            <strong>{selectedMovie.title}</strong>
            <span>·</span>
            <span>{selectedTheater.hall.split('·')[0].trim()}</span>
            <span>·</span>
            <strong className="footer-time">{selectedShowtime}</strong>
          </div>
          <button className="apply-movie-btn" onClick={handleConfirm}>
            Load Cinema Experience 🎬
          </button>
        </div>
      </div>
    </div>
  )
}
