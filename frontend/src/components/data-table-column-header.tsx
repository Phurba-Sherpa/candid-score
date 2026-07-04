import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span>{title}</span>
  }

  const sorted = column.getIsSorted()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      <span>{title}</span>
      {sorted === 'asc' ? (
        <ArrowUp className="size-4" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-4" />
      ) : (
        <ArrowUpDown className="size-4" />
      )}
    </Button>
  )
}
