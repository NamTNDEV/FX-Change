import FxImage from './fx-image'
import LogoSVG from '@/assets/icons/logo/fx-logo-140x140.svg'
import cn from '@/libs/utils'
import Image from 'next/image'
import React from 'react'

function Logo({
  className,
  onClick,
  hideText = false,
}: {
  className?: string
  onClick?: () => void
  hideText?: boolean
}) {
  return (
    <div
      className={cn('pr-3 flex items-center gap-2', className)}
      onClick={onClick && onClick}
    >
      <div className="w-[40px] aspect-square max-lg:w-[35px]">
        <FxImage
          className="flex-shrink"
          src={LogoSVG}
          alt="fx-logo"
        />
      </div>
      {!hideText && (
        <span className="text-xl font-bold tracking-tighter text-gray-700 max-lg:block">
          FXchange
        </span>
      )}
    </div>
  )
}

export default Logo
