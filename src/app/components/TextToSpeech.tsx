"use client"
import React, { useState, FormEvent} from 'react'

export const TextToSpeech = () => {
  const [userText, setUserText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const synth = typeof window !== "undefined" ? window.speechSynthesis: null
  const voices = synth?.getVoices();

  const selectedvoices = voices?.find(voice => voice.name === "Tessa")

  const speak = (textToSpeak : string) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.voice = selectedvoices!;
    synth?.speak(utterance);
  }

  const handleUserText = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    speak(userText);
  }

  return (
    <div className='relative top-0 z-50'>
      <form 
        onSubmit={handleUserText}
        className=' absolute top-[800px] left-[30px] space-x-2 pt-2'>
        <input
        value={userText}
        onChange={(e)=>setUserText(e.target.value)}
        className='bg-transparent w=[510px] border border-[#b00c3f]/80 outline-none rounded-lg 
        placeholder:text=[#b00c3f] p-2' type="text"
        placeholder='what do you want to know human...'/>
        <button
        className='text-[#b00c3f] p-2 border border-[#b00c3f] rounded-lg disabled:text-blue-100 disabled:cursor-not-allowed disabled:bg-gray-500 hocer:scale-110 hover:text-balck hover:bg-[#b00c3f] duration-300 transition-all" '>ASK</button>
      </form>
    </div>
  )
}
