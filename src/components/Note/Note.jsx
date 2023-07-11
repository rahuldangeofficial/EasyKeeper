import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import "./Note.css";

function Note({
  id,
  content,
  deleteNote,
  modifyNote,
  dateCreated,
  lastModified,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localNoteContent, setLocalNoteContent] = useState(content);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    modifyNote(id, localNoteContent);
  };

  const handleDelete = () => {
    deleteNote(id);
  };

  const handleModification = (event) => {
    setLocalNoteContent(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="note-card">
      {isEditing ? (
        <textarea
          className="note-content textarea-autogrow"
          ref={textareaRef}
          value={localNoteContent}
          onChange={handleModification}
          onFocus={adjustTextareaHeight}
        />
      ) : (
        <div className="note-content">{content}</div>
      )}
      <div className="note-meta-info">Created - {dateCreated}</div>
      <div className="note-meta-info">Modified - {lastModified}</div>
      {isEditing ? (
        <div className="note-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </div>
      ) : (
        <div className="note-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

Note.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  deleteNote: PropTypes.func,
  modifyNote: PropTypes.func,
  dateCreated: PropTypes.string,
  lastModified: PropTypes.string,
};

export default Note;
