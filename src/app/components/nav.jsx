import Link from 'next/link'

// page.client.tsx
import React, { useState } from 'react';

export const useSlider = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return { value, handleChange };
};

export const Slider = () => {
  const { value, handleChange } = useSlider();

  return (
    <div className='mt-5'>
      <div className='slider-title'>
        {['1980', '1990', '2000', '2010', '2020', '2021', '2022', 'NOW'].map((year, index) => (
          <span key={index}>{year}</span>
        ))}
      </div>
      <input 
        type='range' 
        min='0' 
        max='7'
        value={value} 
        onChange={handleChange} 
        className='slider'
      />
      {value === '7' && (
        <div className='circle-container'>
          <div className='circle'><Link href={'/detail'}>click!</Link></div>
          <div className='circle'><Link href={'/detail'}>click!</Link></div>
          <div className='circle'><Link href={'/detail'}>click!</Link></div>
        </div>
      )}
    </div>
  );
};