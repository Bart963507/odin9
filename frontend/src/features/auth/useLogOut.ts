import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { clearAuthToken } from '#/features/auth/authToken'

export function useLogOut(): () => void {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    clearAuthToken()
    navigate({ to: '/login' }).then(() => queryClient.clear())
  }
}
