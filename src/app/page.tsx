import React from 'react';
// import Link from 'next/link'
import Image from 'next/image';
import { Slider } from './components/Slider';
import { ChatBorCanvas } from './components/ChatBorCanvas';


export default function Home() {

  return (
    <>
      <div className='flex flex-col items-center min-h-screen relative'>
      <ChatBorCanvas/>
      <Slider />
      </div>
      {/* <button className='click'><Link href={'/detail'}>click!</Link></button> */}
    </>
  )
}