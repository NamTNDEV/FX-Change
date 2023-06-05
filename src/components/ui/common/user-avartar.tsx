import { useAuth } from '@/contexts/auth-context'
import { WithClassName } from '@/types/common'
import { Avatar } from '@mui/joy'
import Image from 'next/image'
import React from 'react'

interface UserAvatarProps extends WithClassName {
  src?: string
  alt?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  size?: 'sm' | 'md' | 'lg'
}

const UserAvatar = ({ src, alt, onClick, size = 'md', ...props }: UserAvatarProps) => {
  const { user } = useAuth()

  const sizes = {
    sm: 30,
    md: 40,
    lg: 60,
  }

  return (
    <button
      className="overflow-hidden rounded-full aspect-square"
      onClick={onClick ?? onClick}
    >
      <Image
        className="w-full h-full aspect-square"
        width={sizes[size]}
        height={sizes[size]}
        {...props}
        src={src || 'https://source.unsplash.com/random'}
        alt={alt || ''}
        rel="noreferrer"
        referrerPolicy="no-referrer"
        // variant="soft"
        // color="primary"
      />
    </button>
  )
}

export default UserAvatar
