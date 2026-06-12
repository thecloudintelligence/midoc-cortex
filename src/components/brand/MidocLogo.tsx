import { cn } from '@/lib/utils'

interface MidocLogoProps {
  variant?: 'full' | 'icon'
  className?: string
}

export function MidocLogo({ variant = 'full', className }: MidocLogoProps) {
  const src =
    variant === 'icon'
      ? '/assets/svgs/midoc-logo-icon.svg'
      : '/assets/svgs/miDocLogo.svg'

  return (
    <img
      src={src}
      alt="miDoc"
      className={cn(
        variant === 'icon' ? 'h-8 w-8' : 'h-10 w-auto',
        className,
      )}
    />
  )
}
