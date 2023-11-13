import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link';

const Header = () => {
  const isLogin:boolean = false;

  return (
    <nav className=' w-[100vw] h-[50px] bg-white text-blue-500 flex justify-between items-center px-[10vw]'>
      <div className='inline-flex space-x-3' id="navLeft">
        <span className=' text-3xl' id="title">
          <Link href='/'>지금세계는</Link>
        </span>
        <ul className='flex items-center' id="littleTitle">
          <li><Link href='/intro'>소개</Link></li>
          <li><Link href='/share'>공유</Link></li>
          <li><Link href='/live'>실시간</Link></li>
          <li><Link href='/acaive'>아카이브</Link></li>
        </ul>
      </div>
      <div className=' space-x-3' id="navRight">
        <span>언어</span>
        { isLogin ? 
          (<>
            <image className=' rounded-full w-[36px] h-[36px] overflow-hidden' href="https://via.placeholder.com/36x36" />
            <span><Link href="/mypage">내 계정</Link></span>
          </>
          ):(
          <>
          <span><Link href='/singin'>로그인</Link></span>
          <span><Link href='/singup'>회원가입</Link></span>
          </>)
        }
      </div>
    </nav>
  )
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '여기 이름넣어야해 초원아',
  description: '이거는 설명이야 초원아',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header/>
        {children}
      </body>
    </html>
  )
}