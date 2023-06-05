import { Type } from '@/types/model'
import { MessageInstance } from 'antd/es/message/interface'
import { createContext, useContext } from 'react'

export type AppContextType = {
  toast?: ToastState
  addingModal: boolean
  onOpen: (type?: Type) => void
  onClose: () => void
  toastIt: (toast: ToastState) => void
  contextHolder: React.ReactElement<any> | null
  messageApi: MessageInstance | null
  [key: string]: any
}

export type ToastState = {
  title?: string
  description?: string
  Action?: React.ReactNode
}

const appContextDefaultValue: AppContextType = {
  addingModal: false,
  onOpen: () => {},
  onClose: () => {},
  contextHolder: null,
  messageApi: null,
  toastIt: () => {},
}

export const AppContext = createContext(appContextDefaultValue)
export const AppProvider = AppContext.Provider

export const useApp = () => {
  return useContext(AppContext)
}
