import './globals.css'
import type { Metadata } from 'next'
// import { Inter } from 'next/font/google' // Interをコメントアウト
import { Noto_Sans_JP } from 'next/font/google' // Noto_Sans_JP をインポート
import Header from '../components/Header'

// const inter = Inter({ subsets: ['latin'] }) // Interをコメントアウト

// Noto Sans JP の設定
const notoSansJP = Noto_Sans_JP({
  weight: ['100', '300', '500', '700'], // 使用するウェイトを指定 (500 を追加)
  subsets: ['latin'], // 通常 'latin' サブセットは不要だが、Next/fontの仕様上必要な場合がある。日本語の場合は通常不要。
  // preload: true, // 必要に応じて
  display: 'swap', // フォント表示戦略
})

export const metadata: Metadata = {
  title: 'Crayon - 1日1コピー配信サービス',
  description: '毎日1つのコピーを配信するサービス',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}> {/* notoSansJP.className を適用 */}
        <Header />
        {children}
      </body>
    </html>
  )
} 