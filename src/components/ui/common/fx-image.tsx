import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

type SafeNumber = number | `${number}`

type Props = {
  className?: string
  src: string
  alt: string
  width?: SafeNumber | undefined
  height?: SafeNumber | undefined
  fill?: boolean | undefined
  quality?: SafeNumber | undefined
  priority?: boolean | undefined
  placeholder?: string
  sizes?: string
}

function FxImage({ className, src, alt, height, width, sizes }: Props) {
  return (
    <Image
      width={width ?? '0'}
      height={height ?? '0'}
      sizes={sizes ?? '100vw'}
      className={clsx('w-full', className)}
      alt={alt}
      priority={true}
      src={src}
    />
  )
}

export default FxImage
