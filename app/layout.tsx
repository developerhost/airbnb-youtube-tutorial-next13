import { Nunito } from 'next/font/google'

import './globals.css'
import { Inter } from 'next/font/google'

import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import Modal from './components/modals/Modal'
import RegisterModal from './components/modals/RegisterModal'
import LoginModal from './components/modals/loginModal'
import useRegisterModal from '@/app/hooks/useRegisterModal';
import ToasterProvider from './providers/ToasterProvider'
import getCurrentUser from './actions/getCurrentUser'

const inter = Inter({ subsets: ['latin'] })

const font = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb clone built with Next.js and Tailwind CSS',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}  className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
