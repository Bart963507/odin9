import { Card, Image, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { PlayerRow } from './playersQuery'
import classes from './playerCard.module.css'

type PlayerCardProps = {
  player: PlayerRow
}

const DEFAULT_SHIRT_COLOR = '#da0b00'
const SHIRT_NUMBER_ONE_COLOR = '#3491bd'

type PlayerCardColumn = {
  key: 'role' | 'position'
  label: string
  value: string
}

export function PlayerCard({ player }: PlayerCardProps) {
  const columns = mapColumns(player)
  const shirtColor =
    player.number === '1' ? SHIRT_NUMBER_ONE_COLOR : DEFAULT_SHIRT_COLOR

  return (
    <Card
      withBorder
      padding="md"
      className={classes.card}
      renderRoot={(props) => (
        <Link
          {...props}
          to="/players/$playerId"
          params={{ playerId: String(player.id) }}
        />
      )}
    >
      <Card.Section className={classes.top}>
        <Image
          src={playerPhotoUrl(player)}
          fallbackSrc={`${import.meta.env.BASE_URL}player.png`}
          alt=""
          fit="contain"
          className={classes.photo}
        />
      </Card.Section>
      <Text size="sm" mt="md">
        {player.first_name}
      </Text>
      <Text fw={700} tt="uppercase">
        {player.last_name}
      </Text>
      <div className={classes.details}>
        {columns.map((column) => (
          <div key={column.key} className={classes.metadata}>
            <Text size="xs" c="dimmed">
              {column.label}
            </Text>
            <Text size="sm" fw={600} className={classes.metaValue}>
              {column.value || '—'}
            </Text>
          </div>
        ))}
        {player.number !== null && (
          <span
            className={classes.shirtNumber}
            role="img"
            aria-label={`Shirt number ${player.number}`}
            style={{ backgroundColor: shirtColor }}
          >
            <span aria-hidden="true">{player.number}</span>
          </span>
        )}
      </div>
    </Card>
  )
}

function mapColumns(row: PlayerRow): PlayerCardColumn[] {
  return [
    { key: 'role', label: 'Rol', value: row.role },
    { key: 'position', label: 'Positie', value: row.position },
  ]
}

export function playerPhotoUrl(player: PlayerRow): string {
  const slug = `${player.first_name} ${player.last_name}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `/players/${slug}.png`
}
