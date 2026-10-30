import { Table } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { PlayerStatsRow } from './statsQuery'
import classes from './statsTable.module.css'

type StatsTableProps = {
  rows: PlayerStatsRow[]
}

export function StatsTable({ rows }: StatsTableProps) {
  const navigate = useNavigate()
  const [sort, setSort] = useState<{
    key: StatsColumn['key']
    direction: 'descending' | 'ascending'
  } | null>(null)
  const headers = rows.length > 0 ? mapColumns(rows[0]) : []
  const sortedRows = sort
    ? [...rows].sort((left, right) => {
        const leftValue = getSortValue(left, sort.key)
        const rightValue = getSortValue(right, sort.key)
        const comparison =
          typeof leftValue === 'number' && typeof rightValue === 'number'
            ? leftValue - rightValue
            : String(leftValue).localeCompare(String(rightValue), 'nl')

        return sort.direction === 'descending' ? -comparison : comparison
      })
    : rows

  function toggleSort(key: StatsColumn['key']) {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: 'descending' }
      if (current.direction === 'descending') {
        return { key, direction: 'ascending' }
      }
      return null
    })
  }

  return (
    <Table.ScrollContainer minWidth={600}>
      <Table
        striped
        highlightOnHover
        withTableBorder
        stickyHeader
        className={classes.table}
      >
        <Table.Thead className={classes.head}>
          <Table.Tr>
            {headers.map((column) => (
              <Table.Th
                key={column.key}
                aria-sort={sort?.key === column.key ? sort.direction : 'none'}
              >
                <button
                  type="button"
                  className={classes.sortButton}
                  onClick={() => toggleSort(column.key)}
                >
                  {column.label}
                  <span aria-hidden="true" className={classes.sortIcon}>
                    {sort?.key === column.key
                      ? sort.direction === 'descending'
                        ? '↓'
                        : '↑'
                      : '↕︎'}
                  </span>
                </button>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedRows.map((row) => (
            <Table.Tr
              key={row.id}
              className={classes.row}
              onClick={() =>
                navigate({
                  to: '/players/$playerId',
                  params: { playerId: String(row.player_id) },
                })
              }
            >
              {mapColumns(row).map((column) => (
                <Table.Td key={column.key}>{column.value}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

type StatsColumn = {
  key: keyof PlayerStatsRow | 'name'
  label: string
  value: string | number
}

function getSortValue(
  row: PlayerStatsRow,
  key: StatsColumn['key'],
): string | number {
  return key === 'name' ? `${row.first_name} ${row.last_name}` : row[key]
}

function mapColumns(row: PlayerStatsRow): StatsColumn[] {
  return [
    { key: 'name', label: 'Naam', value: `${row.first_name} ${row.last_name}` },
    { key: 'games_played', label: 'Wedstrijden', value: row.games_played },
    { key: 'goals', label: 'Doelpunten', value: row.goals },
    { key: 'assists', label: 'Assists', value: row.assists },
    { key: 'own_goals', label: 'Eigen doelpunten', value: row.own_goals },
    { key: 'yellow_cards', label: 'Gele kaarten', value: row.yellow_cards },
    { key: 'red_cards', label: 'Rode kaarten', value: row.red_cards },
    {
      key: 'throwins_failed',
      label: 'Mislukte inworpen',
      value: row.throwins_failed,
    },
    { key: 'injuries', label: 'Blessures', value: row.injuries },
    { key: 'clean_sheets', label: 'Propere lakens', value: row.clean_sheets },
  ]
}
