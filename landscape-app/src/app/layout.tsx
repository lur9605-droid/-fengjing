import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MobileNavigation from '@/components/MobileNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '风景探索墙 - 分享美丽的自然风光',
  description: '发现和分享世界各地的美丽风景照片，记录旅行的美好时光',
  keywords: '风景,摄影,旅行,自然风光,照片分享',
  authors: [{ name: '风景探索墙' }],
  openGraph: {
    title: '风景探索墙',
    description: '发现和分享世界各地的美丽风景照片',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} main-content`}>
        {children}
        <MobileNavigation />
      </body>
    </html>
  )
}
