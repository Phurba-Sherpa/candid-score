import { createBrowserRouter } from 'react-router-dom'

import App from '@/App'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PublicRoute } from '@/components/auth/public-route'
import { CandidateDetailPage } from '@/pages/candidate-detail-page'
import { CandidatesPage } from '@/pages/candidates-page'
import { LoginPage } from '@/pages/login-page'
import { NotFoundPage } from '@/pages/not-found-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
          {
            path: 'login',
            element: <LoginPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'candidates',
            element: <CandidatesPage />,
          },
          {
            path: 'candidates/:candidateId',
            element: <CandidateDetailPage />,
          },
          {
            path: 'candidate/:candidateId',
            element: <CandidateDetailPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
