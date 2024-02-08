import logo from './assets/logo-nlw-expert.svg'
import { NewNotecard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import { ChangeEvent, useState } from 'react';

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {

  const [search, setSearch] = useState('')

  const [ notes, setNotes ] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')
    if (notesOnStorage) {
      return  JSON.parse(notesOnStorage);
    } else {
      return [];
    }
  })

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)
  }

  const filteredNotes = search !== ''
  ? notes.filter(note => note.content.toLowerCase()
    .includes(search.toLowerCase())) : notes

  function onNoteCreated(content: string) {
    const newNote ={
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes([newNote, ...notes])
    localStorage.setItem('notes',  JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id != id
    })
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
    <img src={logo} alt="logo da nlw Expert" />
    
    <form className="w-full">
      <input 
      onChange={handleSearch}
      type="text" 
      placeholder='Busque em suas notas'
      className="w-full bg-transparent text-3xl outline-none font-semibold tracking-tight placeholder:text-slate-500"/>
    </form>
    <div className='h-px bg-slate-700'/>

    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 auto-rows-[250px]'>
    <NewNotecard onNoteCreated={onNoteCreated} />
    
    {filteredNotes.map(note => {
      return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
    })}

    </div>
    </div>
    )
}