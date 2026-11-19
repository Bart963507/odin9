import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'
import { apiConfig } from '#/config/apiConfig'
import { UnauthorizedError } from '#/features/auth/authErrors'
import { authorizationHeader } from '#/features/auth/authToken'

const eventTypeSchema = z.enum([
  'goal',
  'own_goal',
  'assist',
  'yellow_card',
  'red_card',
  'throwin_failed',
  'injury',
  'clean_sheet',
])

export type EventType = z.infer<typeof eventTypeSchema>

export type GameEvent = {
  gameId: number
  playerId: number
  type: EventType
  minute: number | null
}

const gameEventResponseSchema = z.object({
  id: z.number(),
  game_id: z.number(),
  player_id: z.number(),
  event_type: eventTypeSchema,
  minute: z.number().nullable(),
})

type GameEventResponse = z.infer<typeof gameEventResponseSchema>

export const eventsQueryOptions = queryOptions({
  queryKey: ['events'],
  queryFn: ({ signal }) => fetchEvents({ signal }),
})

async function fetchEvents({
  signal,
}: {
  signal: AbortSignal
}): Promise<GameEvent[]> {
  const response = await fetch(apiConfig.events, {
    signal,
    headers: authorizationHeader(),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch events: ${response.status} ${response.statusText}`,
    )
  }

  const events = z.array(gameEventResponseSchema).parse(await response.json())

  return events.map(toGameEvent)
}

function toGameEvent(response: GameEventResponse): GameEvent {
  return {
    gameId: response.game_id,
    playerId: response.player_id,
    type: response.event_type,
    minute: response.minute,
  }
}
