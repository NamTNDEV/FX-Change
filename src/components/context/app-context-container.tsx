import { AppContextType, AppProvider, ToastState } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { resourceUrls } from '@/libs/resource-urls'
import { WithChildren } from '@/types/WithChildren'
import { Type } from '@/types/model'
import { message } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

const AppContextContainer = ({ children }: WithChildren) => {
  const router = useRouter()
  const [addingModal, setAddingModal] = React.useState<boolean>(false)
  const [toastMeta, setToastMeta] = React.useState<ToastState | undefined>(undefined)

  const [messageApi, contextHolder] = message.useMessage()

  const { user } = useAuth()

  const onOpen = (type: Type = 'default') => {
    if (!user)
      return router.push(resourceUrls.login, {
        query: {
          redirect_url: router.basePath,
        },
      })
    if (type)
      router.push({
        query: {
          stuff_type: type,
        },
      })
    setAddingModal(true)
  }

  const onClose = () => {
    setAddingModal(false)
    router.replace({
      query: {},
    })
  }

  const appState: AppContextType = {
    toast: toastMeta,
    addingModal: addingModal,
    onOpen: onOpen,
    onClose: onClose,
    toastIt: setToastMeta,
    setToast: setToastMeta,
    contextHolder: contextHolder,
    messageApi: messageApi,
  }

  return <AppProvider value={appState}>{children}</AppProvider>
}

export default AppContextContainer
