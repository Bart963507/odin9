import {
  Alert,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Title,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  InvalidPasswordError,
  TooManyLoginAttemptsError,
} from '#/features/auth/authErrors'
import { saveAuthToken } from '#/features/auth/authToken'
import { logIn } from '#/features/auth/loginRequest'
import classes from './loginPage.module.css'

const MAX_PASSWORD_LENGTH = 128
const PASSWORD_HINT =
  'Hint: naam van onze oud trainer 😢 (aan elkaar kleine letters)'

type LoginPageProps = {
  onLoggedIn: () => void
}

export function LoginPage({ onLoggedIn }: LoginPageProps) {
  const [password, setPassword] = useState('')
  const login = useMutation({
    mutationFn: logIn,
    onSuccess: (authToken) => {
      saveAuthToken(authToken)
      onLoggedIn()
    },
  })

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login.mutate(password)
  }

  return (
    <div className={classes.page}>
      <Paper
        component="form"
        onSubmit={submit}
        className={classes.card}
        withBorder
        shadow="sm"
        radius="md"
        p="xl"
      >
        <Stack gap="md">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="V.V. Odin logo"
            className={classes.logo}
          />
          <Title order={2} ta="center">
            Odin 9
          </Title>
          <PasswordInput
            label="Wachtwoord"
            description={PASSWORD_HINT}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            maxLength={MAX_PASSWORD_LENGTH}
            autoComplete="current-password"
            required
            autoFocus
          />
          {login.isError && (
            <Alert color="red" role="alert">
              {loginErrorMessage(login.error)}
            </Alert>
          )}
          <Button type="submit" loading={login.isPending} fullWidth>
            Inloggen
          </Button>
        </Stack>
      </Paper>
    </div>
  )
}

function loginErrorMessage(error: Error): string {
  if (
    error instanceof InvalidPasswordError ||
    error instanceof TooManyLoginAttemptsError
  ) {
    return error.message
  }

  return 'Inloggen is mislukt, probeer het later opnieuw'
}
