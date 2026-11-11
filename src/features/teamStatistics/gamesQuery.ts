import { queryOptions } from '@tanstack/react-query'
import { apiConfig } from '#/config/apiConfig'
import { fetchCsv } from '#/lib/fetchCsv'

export type GameRow = {
  id: number
  date: string
  home: string
  away: string
  competition: string
  goals_odin: number | string | null
  goals_opponent: number | string | null
}

export const gamesQueryOptions = queryOptions({
  queryKey: ['games'],
  queryFn: ({ signal }) => fetchCsv<GameRow>(apiConfig.games, { signal }),
})
