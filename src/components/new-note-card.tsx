import * as Dialog from '@radix-ui/react-dialog'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'
import {X} from 'lucide-react'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNotecard({ onNoteCreated} : NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    function handleStartEditor() {
      setShouldShowOnboarding(false)
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
      setContent(event.target.value)
      console.log(content)
      if (event.target.value === '') {
        setShouldShowOnboarding(true)
      }
    }

    function handleSaveNote(event: FormEvent) {
      event.preventDefault()
      if (content === '') {
        return
      }
      onNoteCreated(content)

      setContent('')
      setShouldShowOnboarding(true)
      toast.success("Nota criada com sucesso")
    }

    function handleStartRecording() {
      const isSpeechRecogntionAPIAvailable =  'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

      if (!isSpeechRecogntionAPIAvailable) {
        alert("Infelizmente seu navegador não suporta a API de gravação")
        return
      }

      setIsRecording(true)
      setShouldShowOnboarding(false)

      const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
      speechRecognition = new speechRecognitionAPI()

      speechRecognition.lang = 'pt-BR'
      speechRecognition.continuous = true
      speechRecognition.maxAlternatives = 1
      speechRecognition.interimResults = true
      speechRecognition.onresult = (event) => {
        const transcription = Array.from(event.results).reduce((text, result) => {
          return text.concat(result[0].transcript)
        }, '')

        setContent(transcription)
      }
      speechRecognition.onerror = (event) => {
        console.error(event)
      }
      speechRecognition.start()
    }

    function handleStopRecording() {
      setIsRecording(false)

      if (speechRecognition !== null)
      speechRecognition.stop()
    }

    return (
            <Dialog.Root>
            <Dialog.Trigger className='rounded-md text-left bg-slate-700 p-5 flex flex-col gap-3 hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-400 outline-none '>
                <span className="text-sm font-medium text-slate-200">
                  Adicionar nota
                </span>
                <p className="text-sm leading-6 text-slate-400">
                  Grave uma nota em aúdio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
            <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
              <Dialog.Content className='overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none'>
                <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                  <X className='size-5'/>
                </Dialog.Close>

                <form className='flex-1 flex flex-col'>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                      <span className="text-sm font-medium text-slate-300">
                        Adicionar nota
                        </span>

                        {shouldShowOnboarding ? (
                          <p className="text-sm leading-6 text-slate-400">
                          Comece <button type='button' onClick={handleStartRecording} className='font-md text-lime-400 hover:underline'>gravando uma nota</button> em aúdio ou se preferir <button onClick={handleStartEditor} className='font-md text-lime-400 hover:underline'>utilize apenas texto</button>
                            </p>
                        ) : (
                          <textarea onChange={handleContentChange} 
                          autoFocus 
                          value={content}
                          className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'/>
                        )}

                </div>

                          {isRecording ? (
                            <button 
                            type='button' 
                            onClick={handleStopRecording}
                            className='flex items-center justify-center gap-2 w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'>
                              <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                              Gravando! (Clique para interromper)</button>
                          ) : (
                            <button 
                type='button' onClick={handleSaveNote} 
                className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'>
                  Salvar nota</button>
                          )}

                  </form>
              </Dialog.Content>
            </Dialog.Portal>


            </Dialog.Root>
    )
}