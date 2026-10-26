import { queryOptions } from '@tanstack/react-query'
import { apiConfig } from '#/config/apiConfig'
import { fetchCsv } from '#/lib/fetchCsv'

export type EventType =
  'goal' | 'assist' | 'own_goal' | 'yellow_card' | 'red_card' | 'injury'

export type EventRow = {
  game: number
  event: EventType
  player_id: number
}

export const eventsQueryOptions = queryOptions({
  queryKey: ['events'],
  queryFn: ({ signal }) => fetchCsv<EventRow>(apiConfig.events, { signal }),
})
