const API_URL = import.meta.env.VITE_API_URL

export const apiConfig = {
  players: `${API_URL}/players`,
  games: `${API_URL}/games`,
  stats: `${API_URL}/stats`,
  events: `${API_URL}/events`,
  appearances: `${API_URL}/appearances`,
} as const
