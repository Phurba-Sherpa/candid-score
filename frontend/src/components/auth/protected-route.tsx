import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { getSession } from '@/features/auth/api/session'

export function ProtectedRoute() {
  const location = useLocation()
  const session = getSession()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
