import Header from '../ui/common/header'
import AddingModal from '../ui/stuff/adding-modal'
import { useApp } from '@/contexts/app-context'
import cn from '@/libs/utils'
import { inter } from '@/pages/_app'
import { WithChildren } from '@/types/WithChildren'
import { message } from 'antd'
import type { ReactElement } from 'react'

function AppLayout({ children }: WithChildren) {
  const { addingModal, onClose, contextHolder } = useApp()

  return (
    <>
      <Header />
      <main className={cn(inter.className, 'bg-white py-8 min-h-[calc(100vh-61px)]')}>
        {contextHolder}
        <div className="container">{children}</div>
        <AddingModal
          onClose={onClose}
          open={addingModal}
        />
      </main>
    </>
  )
}

export function getAppLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>
}

export default AppLayout
