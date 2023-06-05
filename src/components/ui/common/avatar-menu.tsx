import UserAvatar from './user-avartar'
import { useAuth } from '@/contexts/auth-context'
import { User } from '@/types/model'
import { Menu, MenuItem } from '@mui/joy'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type AvatarMenuProps = {
  user: User
}

function AvatarMenu({ user }: AvatarMenuProps) {
  const { signOut } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const avatarDropdownMenuItems = [
    {
      label: 'Trang cá nhân',
      action: () => {
        router.push('/profile')
      },
    },
    {
      label: 'Đăng xuất',
      action: signOut,
    },
  ]

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <UserAvatar
        src={user.photo_url || undefined}
        aria-controls={open ? 'dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      />
      {user && (
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          aria-labelledby="dropdown-menu"
          placement="bottom-end"
          autoFocus={false}
          color="neutral"
        >
          {avatarDropdownMenuItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                item.action()
                handleClose()
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  )
}

export default AvatarMenu
