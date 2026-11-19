import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'
import { apiConfig } from '#/config/apiConfig'
import { UnauthorizedError } from '#/features/auth/authErrors'
import { authorizationHeader } from '#/features/auth/authToken'

export type Appearance = {
  gameId: number
  playerId: number
}

const appearanceResponseSchema = z.object({
  id: z.number(),
  game_id: z.number(),
  player_id: z.number(),
  started: z.boolean().nullable(),
  minutes_played: z.number().nullable(),
})

type AppearanceResponse = z.infer<typeof appearanceResponseSchema>

export const appearancesQueryOptions = queryOptions({
  queryKey: ['appearances'],
  queryFn: ({ signal }) => fetchAppearances({ signal }),
})

async function fetchAppearances({
  signal,
}: {
  signal: AbortSignal
}): Promise<Appearance[]> {
  const response = await fetch(apiConfig.appearances, {
    signal,
    headers: authorizationHeader(),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch appearances: ${response.status} ${response.statusText}`,
    )
  }

  const appearances = z
    .array(appearanceResponseSchema)
    .parse(await response.json())

  return appearances.map(toAppearance)
}

function toAppearance(response: AppearanceResponse): Appearance {
  return {
    gameId: response.game_id,
    playerId: response.player_id,
  }
}
