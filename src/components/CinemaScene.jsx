import React from 'react'
import Screen from './Screen'
import Seat from './Seat'
import TheaterRoom from './TheaterRoom'
import CameraController from './CameraController'

/*
  CinemaScene:
  - Renders 100 seats based on active showtime occupancy
  - Dynamically projects selected movie onto 3D screen
  - Controls lighting modes (House Lights ON vs Movie Mode OFF)
*/

export default function CinemaScene({
  movie,
  theater,
  showtime,
  seats,
  selectedSeat,
  confirmedSeat,
  isSittingView,
  isLightsOn = true,
  onSelectSeat,
  onExitSitting,
}) {
  const themeColor = movie?.themeColor || '#38bdf8'

  return (
    <>
      {/* ══════════ AUDITORIUM LIGHTING ══════════ */}

      {/* Ambient fill light */}
      <ambientLight
        intensity={isLightsOn ? 0.8 : 0.32}
        color={isLightsOn ? '#fffbeb' : '#94a3b8'}
      />

      {/* Primary overhead downlight (ceiling to floor) */}
      <directionalLight
        position={[0, 14, 4]}
        intensity={isLightsOn ? 0.9 : 0.25}
        color={isLightsOn ? '#fef3c7' : '#93c5fd'}
      />

      {/* Screen reflection light (matching movie theme) */}
      <pointLight
        position={[0, 5, -12]}
        intensity={isLightsOn ? 25 : 45}
        distance={24}
        color={themeColor}
      />

      {/* Warm entrance & back auditorium illumination */}
      <pointLight
        position={[0, 6, 9]}
        intensity={isLightsOn ? 18 : 6}
        distance={16}
        color="#f59e0b"
      />

      {/* Side wall atmospheric lights */}
      <pointLight
        position={[-9, 5, -2]}
        intensity={isLightsOn ? 10 : 6}
        distance={12}
        color={isLightsOn ? '#fbbf24' : themeColor}
      />
      <pointLight
        position={[9, 5, -2]}
        intensity={isLightsOn ? 10 : 6}
        distance={12}
        color={isLightsOn ? '#fbbf24' : themeColor}
      />

      {/* ══════════ CAMERA CONTROLLER ══════════ */}
      <CameraController
        selectedSeat={selectedSeat}
        confirmedSeat={confirmedSeat}
        isSittingView={isSittingView}
        onExitSitting={onExitSitting}
      />

      {/* ══════════ THEATER ENVIRONMENT ══════════ */}
      <TheaterRoom isLightsOn={isLightsOn} />

      {/* ══════════ DYNAMIC MOVIE SCREEN ══════════ */}
      <Screen
        movie={movie}
        theater={theater}
        showtime={showtime}
        position={[0, 4.5, -14]}
      />

      {/* ══════════ 100 DYNAMIC SEATS ══════════ */}
      {seats.map((seat) => (
        <Seat
          key={seat.id}
          id={seat.id}
          row={seat.row}
          number={seat.number}
          position={seat.position}
          isOccupied={seat.isOccupied}
          isSelected={selectedSeat?.id === seat.id}
          isConfirmed={confirmedSeat?.id === seat.id}
          isLightsOn={isLightsOn}
          onSelect={() => onSelectSeat(seat)}
        />
      ))}
    </>
  )
}
