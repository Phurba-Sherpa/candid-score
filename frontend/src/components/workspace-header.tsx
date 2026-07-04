import { Link } from 'react-router-dom'

import { getSession } from '@/features/auth/api/session'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/logout-button'

type WorkspaceHeaderProps = {
  title: string
  description: string
  backHref?: string
  backLabel?: string
}

export function WorkspaceHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
}: WorkspaceHeaderProps) {
  const session = getSession()

  return (
    <header className="flex flex-col gap-6 rounded-[2rem] border border-[#ccd1ff] bg-white/90 p-6 shadow-[0_20px_60px_rgba(0,26,255,0.08)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          {backHref ? (
            <Button
              asChild
              variant="ghost"
              className="-ml-4 w-fit text-[#001099] hover:bg-[#e6e8ff] hover:text-[#0017e6]"
            >
              <Link to={backHref}>{backLabel}</Link>
            </Button>
          ) : null}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4d5fff]">
              Candid Score Workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#00084d] sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start">
          {session ? (
            <Badge
              variant="outline"
              className="border-[#99a3ff] bg-[#e6e8ff] px-3 py-1 text-[#001099]"
            >
              {session.role}
            </Badge>
          ) : null}
          <LogoutButton
            variant="outline"
            className="border-[#ccd1ff] text-[#001099] hover:bg-[#e6e8ff]"
          />
        </div>
      </div>
    </header>
  )
}
