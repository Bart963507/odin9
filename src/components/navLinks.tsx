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
    </>
  )
}
