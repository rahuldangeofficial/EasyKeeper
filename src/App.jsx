import { useState, useEffect, useRef } from "react";
import "./App.css";
import Note from "./components/Note/Note";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import "firebase/auth";
import "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_REACT_FIREBASE_API_KEY,
  authDomain: process.env.VITE_REACT_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_REACT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_REACT_FIREBASE_BUCKET,
  messagingSenderId: process.env.VITE_REACT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_REACT_FIREBASE_APP_ID,
  measurementId: process.env.VITE_REACT_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [notesList, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
        setUser(user);
        fetchNotes(user.uid);
      } else {
        console.log("User is signed out");
        setUser(null);
        setNotes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchNotes = async (userId) => {
    try {
      const notesRef = collection(firestore, "notes");
      const querySnapshot = await getDocs(notesRef);
      const notes = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userId) {
          notes.push({ id: doc.id, ...doc.data() });
        }
      });
      setNotes(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleCreateInputChange = (event) => {
    setNoteContent(event.target.value);
    adjustTextareaHeight();
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateNote = async () => {
    if (noteContent.trim() !== "") {
      const newNote = {
        content: noteContent,
        dateCreated: new Date().toLocaleString(),
        lastModified: new Date().toLocaleString(),
        userId: user.uid,
      };

      const notesRef = collection(firestore, "notes");

      try {
        const docRef = await addDoc(notesRef, newNote);
        const newNoteWithId = { ...newNote, id: docRef.id };
        setNotes((prevNotes) => [...prevNotes, newNoteWithId]);
        setNoteContent("");
        adjustTextareaHeightInstantly();
      } catch (error) {
        console.error("Error creating note:", error);
      }
    }
  };

  const saveNotes = async () => {
    if (user) {
      const userId = user.uid;

      try {
        const userDocRef = doc(firestore, "users", userId);
        await setDoc(userDocRef, {
          notes: notesList ? notesList : [],
        });
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    }
  };

  const deleteNoteById = async (id) => {
    try {
      await deleteDoc(doc(firestore, "notes", id));

      // Remove the deleted note from the local state
      const newNotes = notesList.filter((note) => note.id !== id);
      setNotes(newNotes);

      // Update the notes in Firestore
      await saveNotes(newNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const modifyNoteById = async (id, newContent) => {
    try {
      const noteRef = doc(firestore, "notes", id);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        await updateDoc(noteRef, {
          content: newContent,
          lastModified: new Date().toLocaleString(),
        });

        // Update the note in the local state
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

        // Update the notes in Firestore
        await saveNotes(updatedNotes);
      }
    } catch (error) {
      console.error("Error modifying note:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreateNote();
  };

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

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User signed in:", result.user.uid);
        setUser(result.user);
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
        setUser(null);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <>
      <div className="container">
        <h1 className="header">EasyKeeper</h1>
        {user ? (
          <button onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button onClick={handleSignIn}>Sign In with Google</button>
        )}
      </div>
      {user && (
        <>
          <div className="container">
            <input
              className="search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search"
            />
          </div>
          <div className="container">
            <form className="create-card" onSubmit={handleSubmit}>
              <textarea
                className="create-content textarea-autogrow"
                ref={textareaRef}
                value={noteContent}
                onChange={handleCreateInputChange}
                onFocus={adjustTextareaHeight}
                placeholder="Take a note..."
              />

              <div className="create-actions">
                <button type="submit" disabled={!noteContent.trim()}>
                  Create
                </button>
              </div>
            </form>
          </div>
          <div className="container">
            {notesList
              .filter(
                (note) =>
                  note.content
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  note.dateCreated
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  note.lastModified
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map(({ id, content, dateCreated, lastModified }) => (
                <Note
                  key={id}
                  id={id}
                  deleteNote={deleteNoteById}
                  modifyNote={modifyNoteById}
                  content={content}
                  dateCreated={dateCreated}
                  lastModified={lastModified}
                />
              ))}
          </div>
        </>
      )}
    </>
  );
}

export default App;
