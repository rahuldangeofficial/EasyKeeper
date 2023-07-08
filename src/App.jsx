import { useState, useEffect } from "react";
import "./App.css";
import Note from "./components/Note/Note";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [notesList, setNotes] = useState([]);
  const [noteContent, setInputValue] = useState("");
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    const storedNotes = localStorage.getItem("notesList");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
    } else {
      localStorage.setItem("notesList", JSON.stringify(notesList));
    }
  }, [isInitialMount, notesList]);

  function createNote() {
    return {
      id: uuidv4(),
      content: noteContent,
    };
  }

  function handleCreateNote() {
    if (noteContent.trim() !== "") {
      const newNote = createNote();
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setInputValue("");
    }
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function deleteNoteById(id) {
    const newNotes = notesList.filter((obj) => obj.id !== id);
    setNotes(newNotes);
  }

  function modifyNoteById(id, newContent) {
    const updatedNotes = notesList.map((note) => {
      if (note.id === id) {
        return { ...note, content: newContent };
      }
      return note;
    });
    setNotes(updatedNotes);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleCreateNote();
  }

  return (
    <>
      <div className="container">
        <p>EasyKeeper v1.0.0</p>
      </div>

      <div className="container">
        <form className="create-card" onSubmit={handleSubmit}>
          <textarea
            className="create-content"
            value={noteContent}
            onChange={handleInputChange}
          />
          
          <div className="create-actions">
            <button type="submit" disabled={!noteContent.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>

      <div className="container">
        {notesList.map(({ id, content }) => (
          <Note
            key={id}
            deleteNote={() => deleteNoteById(id)}
            modifyNote={(newContent) => modifyNoteById(id, newContent)}
            content={content}
          />
        ))}
      </div>
    </>
  );
}

export default App;
