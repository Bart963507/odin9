import { Burger, Group, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { NavLinks } from '#/components/navLinks'
import classes from './appHeader.module.css'

type AppHeaderProps = {
  navOpened: boolean
  onToggleNav: () => void
}

export function AppHeader({ navOpened, onToggleNav }: AppHeaderProps) {
  return (
    <Group h="100%" px="md" gap="xl">
      <Group gap="sm" wrap="nowrap">
        <Burger
          opened={navOpened}
          onClick={onToggleNav}
          hiddenFrom="sm"
          size="sm"
          aria-label="Menu"
        />
        <Link to="/" className={classes.brand}>
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="V.V. Odin logo"
            className={classes.logo}
          />
          <Title order={3} className={classes.title}>
            Odin 9
          </Title>
        </Link>
      </Group>
      <Group gap="xs" visibleFrom="sm">
        <NavLinks variant="header" />
      </Group>
    </Group>
  )
}
