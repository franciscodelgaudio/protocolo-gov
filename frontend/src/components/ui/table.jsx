import { cn } from '@/lib/utils'

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn('bg-muted/50', className)} {...props} />
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn('divide-y divide-border [&_tr:last-child]:border-0', className)} {...props} />
}

export function TableFooter({ className, ...props }) {
  return <tfoot className={cn('border-t bg-muted/50 font-medium', className)} {...props} />
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn('transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-medium text-muted-foreground uppercase tracking-wider [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn('px-4 py-3.5 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
}

export function TableCaption({ className, ...props }) {
  return <caption className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
}
