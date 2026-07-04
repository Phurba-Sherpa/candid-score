import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from '@/app/query-client'
import { router } from '@/app/router'
import { Toaster } from '@/components/ui/sonner'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)
