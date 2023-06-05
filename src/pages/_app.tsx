import '../styles/globals.css'
import AppContextContainer from '@/components/context/app-context-container'
import AuthContextContainer from '@/components/context/auth-context-container'
import { SocketProvider } from '@/components/context/socket-provider'
import { getAppLayout } from '@/components/layouts/app-layout'
import { MUICssProvider } from '@/components/ui/customs/custom-css-vars-provider'
import client from '@/graphql'
import { ApolloProvider } from '@apollo/client'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { ReactElement, ReactNode } from 'react'

export const inter = Inter({ subsets: ['latin'] })

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || getAppLayout

  return (
    <ApolloProvider client={client}>
      <AuthContextContainer>
        <AppContextContainer>
          <SocketProvider>
            <MUICssProvider>{getLayout(<Component {...pageProps} />)}</MUICssProvider>
          </SocketProvider>
        </AppContextContainer>
      </AuthContextContainer>
    </ApolloProvider>
  )
}
