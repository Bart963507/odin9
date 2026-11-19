import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { readValidAuthToken } from '#/features/auth/authToken'
import { LoginPage } from '#/features/auth/loginPage'

const loginSearchSchema = z.object({
  redirect: z
    .string()
    .regex(/^\/(?!\/)/)
    .optional()
    .catch(undefined),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: ({ search }) => {
    if (readValidAuthToken() !== null) {
      throw redirect({ to: search.redirect ?? '/' })
    }
  },
  component: LoginRoute,
})

function LoginRoute() {
  const search = Route.useSearch()
  const navigate = useNavigate()

  return (
    <LoginPage onLoggedIn={() => navigate({ to: search.redirect ?? '/' })} />
  )
}
