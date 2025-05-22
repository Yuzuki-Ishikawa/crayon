import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import Header from '@/components/Header'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'

const noto = Noto_Sans_JP({
  weight: ['100', '300', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'まいにち広告部',
  description: '毎日1つのコピーを配信するサービス',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body 
          className={noto.className} 
        >
          <Header />
          <main>
            {children}
          </main>
        </body>
      </ThemeProvider>
    </html>
  )
} 