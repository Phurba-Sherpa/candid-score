import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The route does not exist yet.
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link to="/">Back home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
