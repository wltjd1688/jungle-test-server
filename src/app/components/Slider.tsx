'use client'
import React, { ChangeEvent, useState } from 'react';
import Link from 'next/link';

export const useSlider = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return { value, handleChange };
};

export const Slider: React.FC = () => {
  const { value, handleChange } = useSlider();
  const [yearList ,setYearList]= useState([1980,1990,2000,2010,2020,2023])

  return (
    <div className='mt-5 flex relative z-10'>
      <input 
        type='range' 
        min='0' 
        max='7'
        value={value} 
        onChange={handleChange} 
        className='slider'
        list='years'
      />
      <datalist className=' text-white' id="years">
        {yearList.map((i,e)=>{
          return (
          <div key={e} className='text-white'>
            <div>{i}</div>
            <option value={i}>{i}</option>
          </div>);
        })}
      </datalist>
      {value === 7 && (<></>
        // <div className='circle-container'>
        //   <div className='circle'><Link href={'/detail'}>click!</Link></div>
        //   <div className='circle'><Link href={'/detail'}>click!</Link></div>
        //   <div className='circle'><Link href={'/detail'}>click!</Link></div>
        // </div>
      )}
    </div>
  );
};
