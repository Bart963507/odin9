import { Card, Image, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { Player } from '#/features/players/playersQuery'
import { ShirtNumber } from './components/shirtNumber/shirtNumber'
import classes from './playerCard.module.css'

type PlayerCardProps = {
  player: Player
}

type PlayerCardColumn = {
  key: 'role' | 'position'
  label: string
  value: string
}

export function PlayerCard({ player }: PlayerCardProps) {
  const columns = mapColumns(player)

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
        {player.firstName}
      </Text>
      <Text fw={700} tt="uppercase">
        {player.lastName}
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
        {player.shirtNumber !== null && (
          <ShirtNumber number={player.shirtNumber} role={player.role} />
        )}
      </div>
    </Card>
  )
}

function mapColumns(row: Player): PlayerCardColumn[] {
  return [
    { key: 'role', label: 'Rol', value: row.role },
    { key: 'position', label: 'Positie', value: row.position },
  ]
}

export function playerPhotoUrl(player: Player): string {
  const slug = `${player.firstName} ${player.lastName}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `/players/${slug}.png`
}
