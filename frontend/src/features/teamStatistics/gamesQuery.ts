import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'
import { apiConfig } from '#/config/apiConfig'
import { UnauthorizedError } from '#/features/auth/authErrors'
import { authorizationHeader } from '#/features/auth/authToken'

export type Game = {
  id: number
  date: string
  home: string
  away: string
  competition: string | null
  goalsOdin: number | null
  goalsOpponent: number | null
}

const gameResponseSchema = z.object({
  id: z.number(),
  date: z.iso.date(),
  home: z.string(),
  away: z.string(),
  competition: z.string().nullable(),
  goals_odin: z.number().nullable(),
  goals_opponent: z.number().nullable(),
})

type GameResponse = z.infer<typeof gameResponseSchema>

export const gamesQueryOptions = queryOptions({
  queryKey: ['games'],
  queryFn: ({ signal }) => fetchGames({ signal }),
})

async function fetchGames({
  signal,
}: {
  signal: AbortSignal
}): Promise<Game[]> {
  const response = await fetch(apiConfig.games, {
    signal,
    headers: authorizationHeader(),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch games: ${response.status} ${response.statusText}`,
    )
  }

  const games = z.array(gameResponseSchema).parse(await response.json())

  return games.map(toGame)
}

function toGame(response: GameResponse): Game {
  return {
    id: response.id,
    date: response.date,
    home: response.home,
    away: response.away,
    competition: response.competition,
    goalsOdin: response.goals_odin,
    goalsOpponent: response.goals_opponent,
  }
}
