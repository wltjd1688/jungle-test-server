import Image from 'next/image'
import { TextToSpeech } from './components/TextToSpeech'
import { ChatBorCanvas } from './components/ChatBorCanvas'

export default function Home() {
  return (
    <main className='h-screen'>
      <TextToSpeech/> 
      <ChatBorCanvas/>
    </main>
  )
}
