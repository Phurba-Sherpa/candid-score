import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  )
}

export default App
