import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-muted-dark)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]',
        secondary:
          'border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] shadow-[0px_0px_0px_3px_#E6E7E94D,0px_1px_2px_0px_#C1C2C680,0px_-8px_12px_0px_#D8D8D833_inset] hover:bg-[#E6E7E9]/40',
        ghost: 'hover:bg-[var(--color-border)]/40 text-[var(--color-foreground)]',
        destructive: 'bg-[var(--color-error)] text-white hover:bg-[#aa2e26]',
        outline:
          'border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)]/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-[var(--radius-button)] px-3 text-xs',
        lg: 'h-12 px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button }
