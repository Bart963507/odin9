import { Button, NavLink } from '@mantine/core'
import { Link, useMatchRoute } from '@tanstack/react-router'

type NavLinksProps = {
  variant: 'header' | 'navbar'
  onNavigate?: () => void
}

export function NavLinks({ variant, onNavigate }: NavLinksProps) {
  const matchRoute = useMatchRoute()
  const statsActive = Boolean(matchRoute({ to: '/' }))
  const playersActive = Boolean(matchRoute({ to: '/players', fuzzy: true }))
  const coenDillenActive = Boolean(matchRoute({ to: '/coen-dillen-index' }))

  if (variant === 'header') {
    return (
      <>
        <Button
          variant={statsActive ? 'filled' : 'subtle'}
          renderRoot={(props) => (
            <Link {...props} to="/" onClick={onNavigate} />
          )}
        >
          Statistieken
        </Button>
        <Button
          variant={playersActive ? 'filled' : 'subtle'}
          renderRoot={(props) => (
            <Link {...props} to="/players" onClick={onNavigate} />
          )}
        >
          Spelers
        </Button>
        <Button
          variant={coenDillenActive ? 'filled' : 'subtle'}
          renderRoot={(props) => (
            <Link {...props} to="/coen-dillen-index" onClick={onNavigate} />
          )}
        >
          Coen Dillen-index
        </Button>
      </>
    )
  }

  return (
    <>
      <NavLink
        label="Statistieken"
        active={statsActive}
        renderRoot={(props) => <Link {...props} to="/" onClick={onNavigate} />}
      />
      <NavLink
        label="Spelers"
        active={playersActive}
        renderRoot={(props) => (
          <Link {...props} to="/players" onClick={onNavigate} />
        )}
      />
      <NavLink
        label="Coen Dillen-index"
        active={coenDillenActive}
        renderRoot={(props) => (
          <Link {...props} to="/coen-dillen-index" onClick={onNavigate} />
        )}
      />
    </>
  )
}
