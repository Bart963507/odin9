import { Table } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { PlayerStatsWithName } from './statsQuery'
import classes from './statsTable.module.css'

type StatsTableProps = {
  rows: PlayerStatsWithName[]
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
              key={row.playerId}
              className={classes.row}
              onClick={() =>
                navigate({
                  to: '/players/$playerId',
                  params: { playerId: String(row.playerId) },
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
  key: keyof PlayerStatsWithName | 'name'
  label: string
  value: string | number
}

function getSortValue(
  row: PlayerStatsWithName,
  key: StatsColumn['key'],
): string | number {
  return key === 'name' ? `${row.firstName} ${row.lastName}` : row[key]
}

function mapColumns(row: PlayerStatsWithName): StatsColumn[] {
  return [
    { key: 'name', label: 'Naam', value: `${row.firstName} ${row.lastName}` },
    { key: 'gamesPlayed', label: 'Wedstrijden', value: row.gamesPlayed },
    { key: 'goals', label: 'Doelpunten', value: row.goals },
    { key: 'assists', label: 'Assists', value: row.assists },
    { key: 'ownGoals', label: 'Eigen doelpunten', value: row.ownGoals },
    { key: 'yellowCards', label: 'Gele kaarten', value: row.yellowCards },
    { key: 'redCards', label: 'Rode kaarten', value: row.redCards },
    {
      key: 'throwinsFailed',
      label: 'Mislukte inworpen',
      value: row.throwinsFailed,
    },
    { key: 'injuries', label: 'Blessures', value: row.injuries },
    { key: 'cleanSheets', label: 'Propere lakens', value: row.cleanSheets },
  ]
}
