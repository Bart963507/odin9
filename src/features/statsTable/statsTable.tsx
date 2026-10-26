import { Table } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import type { PlayerStatsRow } from './statsQuery'
import classes from './statsTable.module.css'

type StatsTableProps = {
  rows: PlayerStatsRow[]
}

export function StatsTable({ rows }: StatsTableProps) {
  const navigate = useNavigate()
  const headers = rows.length > 0 ? mapColumns(rows[0]) : []

  return (
    <Table.ScrollContainer minWidth={600}>
      <Table striped highlightOnHover withTableBorder stickyHeader>
        <Table.Thead>
          <Table.Tr>
            {headers.map((column) => (
              <Table.Th key={column.key}>{column.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
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
  key: string
  label: string
  value: string | number
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
      label: 'Mislukte ingooien',
      value: row.throwins_failed,
    },
    { key: 'injuries', label: 'Blessures', value: row.injuries },
  ]
}
