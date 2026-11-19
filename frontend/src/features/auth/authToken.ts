import { z } from 'zod'

const AUTH_TOKEN_STORAGE_KEY = 'odin9-auth-token'

export type AuthToken = {
  token: string
  expiresAt: string
}

const storedAuthTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.iso.datetime({ offset: true }),
})

let currentAuthToken: AuthToken | null = readStoredAuthToken()

export function saveAuthToken(authToken: AuthToken): void {
  currentAuthToken = authToken
  tryStorage(
    (storage) =>
      storage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(authToken)),
    undefined,
  )
}

export function clearAuthToken(): void {
  currentAuthToken = null
  tryStorage((storage) => storage.removeItem(AUTH_TOKEN_STORAGE_KEY), undefined)
}

export function readValidAuthToken(): string | null {
  if (currentAuthToken === null || hasExpired(currentAuthToken)) {
    return null
  }

  return currentAuthToken.token
}

export function authorizationHeader(): Record<string, string> {
  const token = readValidAuthToken()

  return token === null ? {} : { Authorization: `Bearer ${token}` }
}

function readStoredAuthToken(): AuthToken | null {
  const storedValue = tryStorage(
    (storage) => storage.getItem(AUTH_TOKEN_STORAGE_KEY),
    null,
  )

  if (storedValue === null) {
    return null
  }

  const parsed = storedAuthTokenSchema.safeParse(parseJson(storedValue))

  return parsed.success ? parsed.data : null
}

function tryStorage<T>(action: (storage: Storage) => T, fallback: T): T {
  try {
    return action(localStorage)
  } catch {
    return fallback
  }
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function hasExpired(authToken: AuthToken): boolean {
  return Date.parse(authToken.expiresAt) <= Date.now()
}
