import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  format,
} from 'date-fns'

export function formatShortDate(value: string) {
  return format(new Date(value), 'MMM d, yyyy')
}

export function formatAppliedDate(value: string) {
  return format(new Date(value), 'dd MMM, yyyy')
}

export function formatLongDate(value: string) {
  return format(new Date(value), 'MMMM d, yyyy')
}

export function formatRelativeDate(value: string) {
  const date = new Date(value)
  const now = new Date()

  const seconds = Math.max(0, differenceInSeconds(now, date))

  if (seconds < 60) {
    return `${seconds}s ago`
  }

  const minutes = differenceInMinutes(now, date)
  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = differenceInHours(now, date)
  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = differenceInDays(now, date)
  if (days < 30) {
    return `${days}d ago`
  }

  const months = differenceInMonths(now, date)
  if (months < 12) {
    return `${months}mo ago`
  }

  const years = differenceInYears(now, date)
  return `${years}y ago`
}
