"use client"

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google'
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

const images = [
  '지진.png',
  '화산.png',
  '홍수.png',
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const imageStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    transition: 'opacity 1s ease-in-out',
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {images.map((imageUrl, index) => (
        <div
          key={index}
          style={{
            ...imageStyle,
            backgroundImage: `url(${imageUrl})`,
            zIndex: index === currentImageIndex ? 1 : 0,
            opacity: index === currentImageIndex ? 1 : 0,
          }}
        ></div>
      ))}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'start', position: 'absolute', top: '55%', left: '28%', transform: 'translate(-50%, -50%)', zIndex: 2, color: '#fff' }}>
        <h1 style={{ fontSize: '5.5rem' }}>세계 재난재해 아카이브</h1>
        <p style={{ display: 'inline-block', fontSize: '4rem', marginTop: '15px' }}>및 실시간 알림</p>
        <p style={{ display: 'inline-block', fontSize: '1.5rem', marginTop: '30px', border:'3px solid white', padding:'10px 15px' }}><Link href='/archive'>지구로 이동</Link></p>
      </div>
    </div>
  );
}

