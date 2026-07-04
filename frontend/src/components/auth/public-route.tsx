import { Navigate, Outlet } from 'react-router-dom'

import { getSession } from '@/features/auth/api/session'

export function PublicRoute() {
  const session = getSession()

  if (session) {
    return <Navigate to="/candidates" replace />
  }

  return <Outlet />
}
