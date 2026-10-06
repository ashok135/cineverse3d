// TMDB Movie API Service & Multi-Theater Showtime Engine

export const THEATERS = [
  {
    id: 'pvr-imax',
    name: 'PVR INOX: Forum Megaplex',
    hall: 'Auditorium 4 · IMAX Laser',
    location: 'Koramangala, Bangalore',
    formats: ['IMAX 70MM', 'Dolby Atmos', '4K Laser'],
  },
  {
    id: 'cinepolis-dolby',
    name: 'Cinepolis: Nexus Grand',
    hall: 'Auditorium 2 · Dolby Cinema',
    location: 'Whitefield, Bangalore',
    formats: ['Dolby Atmos', 'RealD 3D', 'VIP Recliner'],
  },
  {
    id: 'pvr-directors-cut',
    name: "PVR Director's Cut",
    hall: 'Auditorium 1 · Gold Class',
    location: 'Vasant Kunj, Delhi',
    formats: ['Luxe Recliner', 'Laser Projection', 'Dine-In'],
  },
]

export const SHOWTIMES = [
  '10:30 AM',
  '02:15 PM',
  '06:00 PM',
  '09:30 PM',
  '11:45 PM',
]

// Verified TMDB Theatrical Releases with official TMDB CDN assets & metadata
export const TMDB_MOVIES = [
  {
    id: 157336,
    title: 'INTERSTELLAR',
    director: 'Christopher Nolan',
    releaseYear: '2014',
    rating: 8.7,
    voteCount: '34,800+',
    runtime: '2h 49m',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    certification: 'UA 13+',
    format: 'IMAX 70MM',
    sound: 'DOLBY ATMOS',
    themeColor: '#38bdf8',
    screenColor: '#075985',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    synopsis:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
  },
  {
    id: 693134,
    title: 'DUNE: PART TWO',
    director: 'Denis Villeneuve',
    releaseYear: '2024',
    rating: 8.6,
    voteCount: '19,500+',
    runtime: '2h 46m',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    certification: 'UA 16+',
    format: 'IMAX 1.43:1 LASER',
    sound: 'DOLBY ATMOS 9.1',
    themeColor: '#f59e0b',
    screenColor: '#b45309',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg',
    synopsis:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
  },
  {
    id: 872585,
    title: 'OPPENHEIMER',
    director: 'Christopher Nolan',
    releaseYear: '2023',
    rating: 8.9,
    voteCount: '28,100+',
    runtime: '3h 00m',
    genres: ['Biography', 'Drama', 'History'],
    certification: 'A 18+',
    format: 'IMAX 70MM FILM',
    sound: 'DTS:X MASTER',
    themeColor: '#fb923c',
    screenColor: '#c2410c',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    synopsis:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II with the Manhattan Project.',
  },
  {
    id: 76600,
    title: 'AVATAR: WAY OF WATER',
    director: 'James Cameron',
    releaseYear: '2022',
    rating: 8.1,
    voteCount: '16,200+',
    runtime: '3h 12m',
    genres: ['Action', 'Adventure', 'Fantasy'],
    certification: 'UA 13+',
    format: '3D HFR 48FPS',
    sound: 'DOLBY ATMOS 3D',
    themeColor: '#06b6d4',
    screenColor: '#0e7490',
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZIMQvRjrqqw.jpg',
    synopsis:
      'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri to protect their home.',
  },
  {
    id: 569094,
    title: 'SPIDER-MAN: SPIDER-VERSE',
    director: 'Joaquim Dos Santos',
    releaseYear: '2023',
    rating: 8.8,
    voteCount: '21,400+',
    runtime: '2h 20m',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    certification: 'U',
    format: 'DOLBY CINEMA',
    sound: 'DOLBY ATMOS',
    themeColor: '#ec4899',
    screenColor: '#be185d',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    synopsis:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
  },
  {
    id: 155,
    title: 'THE DARK KNIGHT',
    director: 'Christopher Nolan',
    releaseYear: '2008',
    rating: 9.0,
    voteCount: '41,000+',
    runtime: '2h 32m',
    genres: ['Action', 'Crime', 'Drama'],
    certification: 'UA 16+',
    format: 'IMAX RE-RELEASE',
    sound: 'DOLBY DIGITAL 7.1',
    themeColor: '#38bdf8',
    screenColor: '#1e3a8a',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    synopsis:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  },
]

/*
  Generate realistic BookMyShow seat occupancy per movie, theater & showtime:
  - Deterministic pseudo-randomness based on IDs and showtime
  - Evening shows have higher occupancy (~50-65% booked)
  - Morning shows have lighter occupancy (~25-35% booked)
*/
export function generateShowtimeOccupiedSeats(movieId, theaterId, showtime) {
  const seedString = `${movieId}-${theaterId}-${showtime}`
  let hash = 0
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i)
    hash |= 0
  }

  // PRNG
  let seed = Math.abs(hash)
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const occupiedSet = new Set()

  // Evening shows have more bookings
  const isPrimeTime = showtime.includes('06:00') || showtime.includes('09:30')
  const baseProbability = isPrimeTime ? 0.38 : 0.22

  rows.forEach((row) => {
    // Balcony and Prime rows have higher demand
    const rowMultiplier = ['H', 'I', 'J', 'E', 'F', 'G'].includes(row) ? 1.4 : 0.85
    for (let num = 1; num <= 10; num++) {
      if (random() < baseProbability * rowMultiplier) {
        occupiedSet.add(`${row}${num}`)
      }
    }
  })

  return Array.from(occupiedSet)
}

/*
  Optional Live TMDB API Fetcher:
  Calls live TMDB API if user provides their free API key
*/
export async function fetchLiveTMDBNowPlaying(apiKey) {
  if (!apiKey) return null
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
    )
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`)
    const data = await res.json()
    if (!data.results) return null

    return data.results.slice(0, 6).map((m) => ({
      id: m.id,
      title: m.title.toUpperCase(),
      director: 'Official TMDB Release',
      releaseYear: (m.release_date || '').split('-')[0] || '2024',
      rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0,
      voteCount: `${m.vote_count} votes`,
      runtime: '2h 15m',
      genres: ['Theatrical Release'],
      certification: m.adult ? 'A 18+' : 'UA 13+',
      format: 'IMAX LASER',
      sound: 'DOLBY ATMOS',
      themeColor: '#38bdf8',
      screenColor: '#075985',
      posterUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : TMDB_MOVIES[0].posterUrl,
      backdropUrl: m.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`
        : TMDB_MOVIES[0].backdropUrl,
      synopsis: m.overview || 'Now playing in theatres near you.',
    }))
  } catch (err) {
    console.warn('Failed to fetch live TMDB movies:', err)
    return null
  }
}
