'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useCallback, useRef } from 'react'

const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 items-center justify-center',
    'rounded-lg border border-transparent bg-clip-padding',
    'text-sm font-medium whitespace-nowrap',
    'transition-all duration-150 ease-out',
    'outline-none select-none overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-40 disabled:saturate-50',
    'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'shadow-[0_2px_8px_oklch(0.35_0.1_45/0.25)]',
          'hover:bg-primary/90 hover:shadow-[0_4px_16px_oklch(0.35_0.1_45/0.35)] hover:-translate-y-0.5',
          'active:shadow-[0_1px_4px_oklch(0.35_0.1_45/0.2)]',
        ].join(' '),
        glow: [
          'bg-primary text-primary-foreground',
          'shadow-[0_0_16px_oklch(0.35_0.1_45/0.4),0_4px_16px_oklch(0.35_0.1_45/0.3)]',
          'hover:shadow-[0_0_24px_oklch(0.35_0.1_45/0.6),0_6px_24px_oklch(0.35_0.1_45/0.4)]',
          'hover:-translate-y-0.5 hover:brightness-110',
          'dark:bg-accent dark:text-accent-foreground',
          'dark:shadow-[0_0_16px_oklch(0.75_0.08_140/0.5),0_4px_16px_oklch(0.75_0.08_140/0.3)]',
          'dark:hover:shadow-[0_0_28px_oklch(0.75_0.08_140/0.7),0_6px_24px_oklch(0.75_0.08_140/0.5)]',
        ].join(' '),
        outline: [
          'border-border bg-background text-foreground',
          'hover:bg-secondary hover:border-primary/40 hover:-translate-y-0.5',
          'hover:shadow-[0_4px_12px_oklch(0.2_0.01_40/0.08)]',
        ].join(' '),
        secondary: [
          'bg-secondary text-secondary-foreground border-border/50',
          'hover:bg-secondary/70 hover:border-border hover:-translate-y-0.5',
        ].join(' '),
        ghost: [
          'hover:bg-secondary hover:text-foreground',
          'aria-expanded:bg-secondary aria-expanded:text-foreground',
        ].join(' '),
        destructive: [
          'bg-destructive/10 text-destructive border-destructive/20',
          'hover:bg-destructive/20 hover:-translate-y-0.5',
          'focus-visible:ring-destructive/30',
        ].join(' '),
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
        accent: [
          'bg-accent text-accent-foreground',
          'shadow-[0_2px_8px_oklch(0.55_0.08_140/0.25)]',
          'hover:bg-accent/90 hover:shadow-[0_4px_16px_oklch(0.55_0.08_140/0.35)] hover:-translate-y-0.5',
        ].join(' '),
      },
      size: {
        default: 'h-10 gap-2 px-5',
        xs:      'h-7 gap-1 px-3 text-xs rounded-lg',
        sm:      'h-8 gap-1.5 px-3.5 text-xs',
        lg:      'h-12 gap-2.5 px-7 text-base',
        xl:      'h-14 gap-3 px-8 text-base',
        icon:    'size-10',
        'icon-sm': 'size-8 rounded-lg',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
    ripple?: boolean
  }

function Button({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  ripple = true,
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  // Ripple effect
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && btnRef.current && variant !== 'link') {
        const btn = btnRef.current
        const rect = btn.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height) * 2
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        const rippleEl = document.createElement('span')
        rippleEl.className = 'ripple-effect'
        rippleEl.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`
        btn.appendChild(rippleEl)
        setTimeout(() => rippleEl.remove(), 700)
      }
      onClick?.(e as any)
    },
    [ripple, variant, onClick]
  )

  return (
    <ButtonPrimitive
      ref={btnRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="opacity-75">{children}</span>
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
