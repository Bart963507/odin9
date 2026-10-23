import Papa from 'papaparse'
import { queryOptions, useSuspenseQueries } from '@tanstack/react-query'
import { playersQueryOptions } from '#/features/players/playersQuery'
import type { PlayerRow } from '#/features/players/playersQuery'
import { apiConfig } from '#/config/apiConfig'

export type StatsRow = {
  id: number
  player_id: number
  goals: number
  own_goals: number
  yellow_cards: number
  red_cards: number
  throwins_failed: number
  games_played: number
  ninety_min: number
  assists: number
  injuries: number
}

export interface PlayerStatsRow extends StatsRow {
  first_name: string
  last_name: string
}

const statsQueryOptions = queryOptions({
  queryKey: ['stats'],
  queryFn: ({ signal }) => fetchStats({ signal }),
})

export function usePlayerStats(): PlayerStatsRow[] {
  const [stats, players] = useSuspenseQueries({
    queries: [statsQueryOptions, playersQueryOptions],
  })

  return addPlayerNames(stats.data, players.data)
}

function addPlayerNames(
  stats: StatsRow[],
  players: PlayerRow[],
): PlayerStatsRow[] {
  const playersById = new Map(players.map((player) => [player.id, player]))

  return stats.map((row) => addPlayerName(row, playersById))
}

function addPlayerName(
  row: StatsRow,
  playersById: Map<number, PlayerRow>,
): PlayerStatsRow {
  const player = playersById.get(row.player_id)

  return {
    ...row,
    first_name: player?.first_name ?? '',
    last_name: player?.last_name ?? '',
  }
}

async function fetchStats({ signal }: { signal?: AbortSignal } = {}): Promise<
  StatsRow[]
> {
  const response = await fetch(apiConfig.stats, { signal })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch stats CSV: ${response.status} ${response.statusText}`,
    )
  }

  const csv = await response.text()
  return parseStatsCsv(csv)
}

function parseStatsCsv(csv: string): StatsRow[] {
  return Papa.parse<StatsRow>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  }).data
}
