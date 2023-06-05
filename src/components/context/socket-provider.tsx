import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { SocketContext } from '@/contexts/socket-context'
import socket from '@/libs/socket-io'
import { generateUUID } from '@/libs/utils'
import { WithChildren } from '@/types/WithChildren'
import React, { useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const SocketProvider = ({ children }: WithChildren) => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const { toastIt } = useApp()
  const { user } = useAuth()

  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }
    // Connect to the Socket.IO server
    const uuidGenerator = generateUUID()
    try {
      if (user && user.uid) {
        socket.auth = {
          uid: user.uid,
        }
      } else {
        socket.auth = {
          uid: 'anonymous-' + uuidGenerator,
        }
      }
      // socket.connect()

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)
    } catch (error) {
      toastIt({
        title: 'Lỗi kết nối',
        description: 'Vui lòng kiểm tra kết nối và thử lại.',
      })
    }

    return () => {
      // socket.disconnect()
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [user])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}

export default SocketContext
