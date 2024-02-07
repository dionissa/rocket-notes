import logo from './assets/logo-nlw-expert.svg'
import { NewNotecard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

export function App() {
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
    <img src={logo} alt="logo da nlw Expert" />
    
    <form className="w-full">
      <input 
      type="text" 
      placeholder='Busque em suas notas'
      className="w-full bg-transparent text-3xl outline-none font-semibold tracking-tight placeholder:text-slate-500"/>
    </form>
    <div className='h-px bg-slate-700'/>

    <div className='grid grid-cols-3 gap-6 auto-rows-[250px]'>
    <NewNotecard />
    <NoteCard 
    note={{
      date: new Date(),
      content: "Hello World"
      }} />
    </div>
    </div>
    )
}