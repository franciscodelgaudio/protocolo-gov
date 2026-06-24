import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        pending: 'border-yellow-200 bg-yellow-100 text-yellow-800',
        accepted: 'border-green-200 bg-green-100 text-green-800',
        rejected: 'border-red-200 bg-red-100 text-red-800',
        in_progress: 'border-blue-200 bg-blue-100 text-blue-800',
        completed: 'border-emerald-200 bg-emerald-100 text-emerald-800',
        cancelled: 'border-gray-200 bg-gray-100 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
