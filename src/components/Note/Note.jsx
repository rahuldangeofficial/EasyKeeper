import { useState } from "react";
import { PropTypes } from "prop-types";
import "./Note.css";

function Note({ content, deleteNote, modifyNote, dateCreated, lastModified }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localNoteContent, setLocalNoteContent] = useState(content);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    modifyNote(localNoteContent);
  };

  const handleDelete = () => {
    deleteNote();
  };

  const handleModification = (event) => {
    setLocalNoteContent(event.target.value);
  };

  return (
    <div className="note-card">
      {isEditing ? (
        <textarea
          className="note-content"
          value={localNoteContent}
          onChange={handleModification}
        />
      ) : (
        <div className="note-content">{content}</div>
      )}
      <div className="note-meta-info">Created - {dateCreated}</div>
      <div className="note-meta-info">Modified - {lastModified}</div>
      {isEditing ? (
        <div className="note-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ) : (
        <div className="note-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

Note.propTypes = {
  content: PropTypes.string,
  deleteNote: PropTypes.func,
  modifyNote: PropTypes.func,
  dateCreated: PropTypes.string,
  lastModified: PropTypes.string,
};

export default Note;
