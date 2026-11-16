import { createFileRoute } from '@tanstack/react-router'
import { Alert, Loader, Stack, Text, Title } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usePlayerStats } from '#/features/statsTable/statsQuery'
import { eventsQueryOptions } from '#/features/events/eventsQuery'
import { seasonGameCount } from '#/features/players/components/marketValueSection/marketValue'
import { ProfileSection } from '#/features/players/components/profileSection/profileSection'
import {
  coenDillenRanking,
  formatGoals,
} from '#/features/coenDillen/coenDillenIndex'
import {
  SEASON_GAMES,
  scaledDillenGoalsAfterRound,
} from '#/features/coenDillen/scaleCoenDillen'
import { CoenDillenChart } from '#/features/coenDillen/components/coenDillenChart/coenDillenChart'

export const Route = createFileRoute('/coen-dillen-index')({
  component: CoenDillenIndexPage,
  pendingComponent: () => <Loader />,
  errorComponent: ({ error }) => (
    <Alert color="red" title="Coen Dillen-index kon niet worden geladen">
      {String(error)}
    </Alert>
  ),
})

function CoenDillenIndexPage() {
  const rows = usePlayerStats()
  const { data: events } = useSuspenseQuery(eventsQueryOptions)
  const currentRound = seasonGameCount(rows, events)
  const ranking = coenDillenRanking(rows, currentRound)

  return (
    <Stack gap="lg">
      <Title order={1}>Coen Dillen-index</Title>
      <Text>
        Coen Dillen scoorde in 1956/57 43 doelpunten in 34 wedstrijden. Zijn
        tempo per speelronde is geschaald naar ons seizoen van {SEASON_GAMES}{' '}
        wedstrijden ({formatGoals(scaledDillenGoalsAfterRound(SEASON_GAMES))}{' '}
        doelpunten). Na speelronde {currentRound} stond Dillen op{' '}
        {formatGoals(scaledDillenGoalsAfterRound(currentRound))} doelpunten.
      </Text>
      <ProfileSection title="Doelpunten per speelronde">
        <CoenDillenChart
          players={ranking}
          events={events}
          currentRound={currentRound}
        />
      </ProfileSection>
    </Stack>
  )
}
