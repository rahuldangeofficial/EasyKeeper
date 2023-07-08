import { useState, useEffect, useRef } from "react";
import "./App.css";
import Note from "./components/Note/Note";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [notesList, setNotes] = useState([]);
  const [noteContent, setInputValue] = useState("");
  const [isInitialMount, setIsInitialMount] = useState(true);
  const textareaRef = useRef(null);

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
      dateCreated: new Date().toLocaleString(),
      lastModified: new Date().toLocaleString(),
    };
  }

  function handleCreateNote() {
    if (noteContent.trim() !== "") {
      const newNote = createNote();
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setInputValue("");
      adjustTextareaHeightInstantly();
    }
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
    adjustTextareaHeight();
  }

  function deleteNoteById(id) {
    const newNotes = notesList.filter((obj) => obj.id !== id);
    setNotes(newNotes);
  }

  function modifyNoteById(id, newContent) {
    const updatedNotes = notesList.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          content: newContent,
          lastModified: new Date().toLocaleString(),
        };
      }
      return note;
    });
    setNotes(updatedNotes);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleCreateNote();
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const adjustTextareaHeightInstantly = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  return (
    <>
      <div className="container">
        <p>EasyKeeper v1.0.0</p>
      </div>

      <div className="container">
        <form className="create-card" onSubmit={handleSubmit}>
          <textarea
            className="create-content textarea-autogrow"
            ref={textareaRef}
            value={noteContent}
            onChange={handleInputChange}
            onFocus={adjustTextareaHeight}
          />

          <div className="create-actions">
            <button type="submit" disabled={!noteContent.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>

      <div className="container">
        {notesList.map(({ id, content, dateCreated, lastModified }) => (
          <Note
            key={id}
            deleteNote={() => deleteNoteById(id)}
            modifyNote={(newContent) => modifyNoteById(id, newContent)}
            content={content}
            dateCreated={dateCreated}
            lastModified={lastModified}
          />
        ))}
      </div>
    </>
  );
}

export default App;
