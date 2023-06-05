import cn from '@/libs/utils'
import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: '1' | '2' | '3' | '4' | undefined | null | string
}

function Badge({ children, className, variant = '1' }: BadgeProps) {
  return (
    <div
      className={cn(
        'min-w-[80px] text-sm text-white bg-primary-700 rounded-lg px-5',
        {
          'bg-primary-500': variant === '1',
          'bg-blue-600': variant === '2',
          'bg-yellow-600': variant === '3',
          'bg-violet-600': variant === '4',
        },
        className
      )}
    >
      {children}
    </div>
  )
}

export default Badge
