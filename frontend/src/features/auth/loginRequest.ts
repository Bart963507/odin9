import { z } from 'zod'
import { apiConfig } from '#/config/apiConfig'
import {
  InvalidPasswordError,
  TooManyLoginAttemptsError,
} from '#/features/auth/authErrors'
import type { AuthToken } from '#/features/auth/authToken'

const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
  expires_at: z.iso.datetime({ offset: true }),
})

type TokenResponse = z.infer<typeof tokenResponseSchema>

export async function logIn(password: string): Promise<AuthToken> {
  const response = await fetch(apiConfig.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  if (response.status === 401) {
    throw new InvalidPasswordError()
  }

  if (response.status === 429) {
    throw new TooManyLoginAttemptsError()
  }

  if (!response.ok) {
    throw new Error(
      `Failed to log in: ${response.status} ${response.statusText}`,
    )
  }

  return toAuthToken(tokenResponseSchema.parse(await response.json()))
}

function toAuthToken(response: TokenResponse): AuthToken {
  return {
    token: response.access_token,
    expiresAt: response.expires_at,
  }
}
