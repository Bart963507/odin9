import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'
import { apiConfig } from '#/config/apiConfig'
import { UnauthorizedError } from '#/features/auth/authErrors'
import { authorizationHeader } from '#/features/auth/authToken'

export enum PlayerRole {
  Goalkeeper = 'Doelman',
  Defender = 'Verdediger',
  Midfielder = 'Middenvelder',
  Forward = 'Aanvaller',
}

export type Player = {
  id: number
  firstName: string
  lastName: string
  role: PlayerRole
  position: string
  shirtNumber: number | null
}

const playerResponseSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum(PlayerRole),
  position: z.string(),
  number: z.number().nullable(),
})

type PlayerResponse = z.infer<typeof playerResponseSchema>

export const playersQueryOptions = queryOptions({
  queryKey: ['players'],
  queryFn: ({ signal }) => fetchPlayers({ signal }),
})

async function fetchPlayers({
  signal,
}: {
  signal: AbortSignal
}): Promise<Player[]> {
  const response = await fetch(apiConfig.players, {
    signal,
    headers: authorizationHeader(),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch players: ${response.status} ${response.statusText}`,
    )
  }

  const players = z.array(playerResponseSchema).parse(await response.json())

  return players.map(toPlayer)
}

function toPlayer(response: PlayerResponse): Player {
  return {
    id: response.id,
    firstName: response.first_name,
    lastName: response.last_name,
    role: response.role,
    position: response.position,
    shirtNumber: response.number,
  }
}
