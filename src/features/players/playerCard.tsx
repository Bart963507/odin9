import { Card, Image, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { PlayerRow } from './playersQuery'
import classes from './playerCard.module.css'

type PlayerCardProps = {
  player: PlayerRow
}

export function PlayerCard({ player }: PlayerCardProps) {
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
    </Card>
  )
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
