import { useApp } from '@/contexts/app-context'
import { AuthProvider } from '@/contexts/auth-context'
import { auth } from '@/libs/firebase'
import { resourceUrls } from '@/libs/resource-urls'
import AuthServices from '@/services/auth.service'
import { WithChildren } from '@/types/WithChildren'
import { User } from '@/types/model'
import { message } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'

const AuthContextContainer = ({ children }: WithChildren) => {
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  const { toastIt } = useApp()
  const [isValidating, setIsValidating] = useState(false)
  const [user, loading, error] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    ;(async () => {
      syncLoginState()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, resourceUrls, userData])

  if (loading) {
    return <div>authenticating...</div>
  }

  if (error || signOutError) {
    toastIt({
      title: 'Lỗi đăng nhập',
      description: 'Vui lòng kiểm tra thông tin đăng nhập và thử lại.',
    })
    router.push(resourceUrls.homepage)
  }

  async function syncLoginState() {
    try {
      if (!loading && user && !userData) {
        const redirectUrl: string | string[] | undefined = router.query.redirectUrl
        setUserData(null)
        setIsValidating(true)
        const userData: User = await AuthServices.signInWithServer(await user.getIdToken())

        setUserData(userData)
        messageApi.success('Đăng nhập thành công')

        if (redirectUrl) {
          return router.push(redirectUrl as string)
        }

        if (router.asPath === resourceUrls.login) {
          return router.push(resourceUrls.homepage)
        }
      }
    } catch (e) {
      console.error(e)
      messageApi.error('Lỗi đăng nhập. Vui lòng thử lại sau.')
      // toastIt({
      //   title: 'Lỗi đăng nhập',
      //   description: 'Vui lòng kiểm tra thông tin đăng nhập và thử lại.',
      // })
      onSignOut()
      setUserData(null)
    } finally {
      setIsValidating(false)
    }
  }

  const onLogin = async () => {
    try {
      messageApi.loading('Đang đăng nhập')
      await AuthServices.signInWithProvider()
    } catch (error) {
      console.log({ error })
      messageApi.error('Lỗi đăng nhập')
    }
  }

  const onSignOut = () => {
    signOut()
    setUserData(null)
    router.reload()
  }

  const redirectToLogin = () => {
    router.push({
      pathname: resourceUrls.login,
      query: {
        redirectUrl: router.asPath,
      },
    })
  }

  return (
    <AuthProvider value={{ user: userData, signOut: onSignOut, signIn: onLogin, redirectToLogin }}>
      {contextHolder}
      {children}
    </AuthProvider>
  )
}

export default AuthContextContainer
