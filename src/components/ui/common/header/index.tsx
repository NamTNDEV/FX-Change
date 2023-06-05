import AvatarMenu from '../avatar-menu'
import Logo from '../logo'
import useLimit from '@/components/hooks/useLimit'
import { AppContext } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { resourceUrls } from '@/libs/resource-urls'
import cn from '@/libs/utils'
import { inter } from '@/pages/_app'
import { Button, IconButton, MenuItem, Menu as JoyMenu } from '@mui/joy'
import { Bell, Menu, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type MenuItem = {
  id: number
  title: string
  slug: string
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: 'Trang chủ',
    slug: resourceUrls.homepage,
  },
  {
    id: 2,
    title: 'Trao đổi',
    slug: resourceUrls.exchange,
  },
  {
    id: 3,
    title: 'Mua bán',
    slug: resourceUrls.market,
  },
  {
    id: 4,
    title: 'Đấu giá',
    slug: resourceUrls.auction,
  },
]

function Header() {
  const router = useRouter()
  const { user } = useAuth()
  const isLimitRender = useLimit('abc')
  const { onOpen } = React.useContext(AppContext)
  const [active, setActive] = React.useState<number>(0)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  if (isLimitRender) return null

  // React.useEffect(() => {

  // }, [router])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (slug?: string) => {
    setAnchorEl(null)
    if (slug) router.push(slug)
  }

  const navigateToLogin = () => {
    router.push(resourceUrls.login)
  }

  const navigateToHome = () => {
    router.push(resourceUrls.homepage)
  }

  return (
    <header className={cn('bg-white border-b', inter.className)}>
      <div className="container relative flex items-center justify-between py-2 ">
        <div className="flex items-center max-lg:gap-4">
          <div className="hidden max-lg:block">
            <IconButton
              color="neutral"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              id="mb-menu"
            >
              <Menu size={30} />
            </IconButton>
            <JoyMenu
              placement="bottom-start"
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              aria-labelledby="mb-menu"
            >
              {menuItems.map((item) => (
                <MenuItem
                  onClick={() => handleClose(item.slug)}
                  key={item.id}
                >
                  {item.title}
                </MenuItem>
              ))}
            </JoyMenu>
          </div>
          <Logo
            onClick={navigateToHome}
            className="cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <ul className="absolute flex items-center p-1 ml-2 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-slate-100 max-lg:hidden w-fit">
            {menuItems.map((item, index) => (
              <Link
                key={item.id}
                id="menu-link"
                href={item.slug}
              >
                <li
                  id="menu-item"
                  className={cn(
                    'text-center text-slate-700 min-w-[120px] py-2 px-4 rounded-full text-sm cursor-pointer',
                    {
                      'bg-white font-semibold': active === index,
                    }
                  )}
                  onClick={() => setActive(index)}
                >
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          {router.asPath !== resourceUrls.homepage && (
            <Button
              variant="soft"
              color="neutral"
              startDecorator={<Plus />}
              onClick={() => onOpen()}
            >
              Thêm mới
            </Button>
          )}

          {user ? (
            <>
              <IconButton
                variant="plain"
                color="neutral"
              >
                <Bell />
              </IconButton>
              <AvatarMenu user={user} />
            </>
          ) : (
            <Button
              variant="solid"
              onClick={navigateToLogin}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
