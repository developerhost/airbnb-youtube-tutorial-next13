import { Nunito } from 'next/font/google'

import './globals.css'
import { Inter } from 'next/font/google'

import Navbar from './components/navbar/Nabvar'
import ClientOnly from './components/ClientOnly'
import Modal from './components/modals/Modal'
import RegisterModal from './components/modals/RegisterModal'
import useRegisterModal from '@/app/hooks/useRegisterModal';
import ToasterProvider from './providers/ToasterProvider'

const inter = Inter({ subsets: ['latin'] })

const font = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb clone built with Next.js and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RegisterModal />
          <Navbar />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
