import { queryOptions, useSuspenseQueries } from '@tanstack/react-query'
import { z } from 'zod'
import { playersQueryOptions } from '#/features/players/playersQuery'
import type { Player } from '#/features/players/playersQuery'
import { apiConfig } from '#/config/apiConfig'

export type PlayerStats = {
  playerId: number
  gamesPlayed: number
  goals: number
  ownGoals: number
  assists: number
  yellowCards: number
  redCards: number
  throwinsFailed: number
  injuries: number
  cleanSheets: number
}

export interface PlayerStatsWithName extends PlayerStats {
  firstName: string
  lastName: string
}

const playerStatsResponseSchema = z.object({
  player_id: z.number(),
  games_played: z.number(),
  goals: z.number(),
  own_goals: z.number(),
  assists: z.number(),
  yellow_cards: z.number(),
  red_cards: z.number(),
  throwins_failed: z.number(),
  injuries: z.number(),
  clean_sheets: z.number(),
})

type PlayerStatsResponse = z.infer<typeof playerStatsResponseSchema>

export const statsQueryOptions = queryOptions({
  queryKey: ['stats'],
  queryFn: ({ signal }) => fetchStats({ signal }),
})

export function usePlayerStats(): PlayerStatsWithName[] {
  const [stats, players] = useSuspenseQueries({
    queries: [statsQueryOptions, playersQueryOptions],
  })

  return addPlayerNames(stats.data, players.data)
}

function addPlayerNames(
  stats: PlayerStats[],
  players: Player[],
): PlayerStatsWithName[] {
  const playersById = new Map(players.map((player) => [player.id, player]))

  return stats.map((row) => addPlayerName(row, playersById))
}

function addPlayerName(
  row: PlayerStats,
  playersById: Map<number, Player>,
): PlayerStatsWithName {
  const player = playersById.get(row.playerId)

  return {
    ...row,
    firstName: player?.firstName ?? '',
    lastName: player?.lastName ?? '',
  }
}

async function fetchStats({
  signal,
}: {
  signal: AbortSignal
}): Promise<PlayerStats[]> {
  const response = await fetch(apiConfig.stats, { signal })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch stats: ${response.status} ${response.statusText}`,
    )
  }

  const stats = z.array(playerStatsResponseSchema).parse(await response.json())

  return stats.map(toPlayerStats)
}

function toPlayerStats(response: PlayerStatsResponse): PlayerStats {
  return {
    playerId: response.player_id,
    gamesPlayed: response.games_played,
    goals: response.goals,
    ownGoals: response.own_goals,
    assists: response.assists,
    yellowCards: response.yellow_cards,
    redCards: response.red_cards,
    throwinsFailed: response.throwins_failed,
    injuries: response.injuries,
    cleanSheets: response.clean_sheets,
  }
}
