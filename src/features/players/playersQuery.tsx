import Papa from 'papaparse'
import { queryOptions } from '@tanstack/react-query'
import { apiConfig } from '#/config/apiConfig'

export type PlayerRow = {
  id: number
  first_name: string
  last_name: string
}

export const playersQueryOptions = queryOptions({
  queryKey: ['players'],
  queryFn: ({ signal }) => fetchPlayers({ signal }),
})

async function fetchPlayers({ signal }: { signal?: AbortSignal } = {}): Promise<
  PlayerRow[]
> {
  const response = await fetch(apiConfig.players, { signal })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch players CSV: ${response.status} ${response.statusText}`,
    )
  }

  const csv = await response.text()
  return parsePlayersCsv(csv)
}

function parsePlayersCsv(csv: string): PlayerRow[] {
  return Papa.parse<PlayerRow>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  }).data.map((row) => ({ ...row, id: Number(row.id) }))
}
