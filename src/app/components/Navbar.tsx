
import '../globals.css'
import Link from 'next/link';
import Image from 'next/image';

export const Navbar = () => {

  const isLogin:boolean = false;

  return (
    <>
      <nav className='topbar'>
        <div className='flex items-center gap-5'>
          <Link href='/' className='flex items-center gap-4'>
            <Image src='/logo.svg' alt='logo' width={28} height={28} />
            <p className='text-heading3-bold text-light-1 max-xs:hidden'>WorlDisaster</p>
          </Link>
          <div className='flex items-center gap-3'>
            <div className='text-xl'><Link href='/archive'>아카이브</Link></div>
            <div className='text-xl'><Link href='/live'>실시간</Link></div>
            <div className='text-xl'><Link href='/share'>공유</Link></div>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='text-xl'>언어</div>
          { isLogin ? 
            (<>
              <image className='rounded-full w-[36px] h-[36px] overflow-hidden' href="https://via.placeholder.com/36x36" />
              <span className='text-xl'><Link href="/mypage">내 계정</Link></span>
            </>
            ):(
            <>
            <span className='text-xl'><Link href='https://worldisaster.com/auth/google'>로그인</Link></span>
            <span className='text-xl'><Link href='/singup'>회원가입</Link></span>
            </>)
          }
        </div>
      </nav>
    </>
  )
}

export default Navbar;