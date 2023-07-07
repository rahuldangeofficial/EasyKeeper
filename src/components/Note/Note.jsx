import { useState } from "react";
import { PropTypes } from "prop-types";
import "./Note.css";

function Note({ content, deleteNote, modifyNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = () => {
    setIsEditing(false);
  };
  const handleDelete = () => {
    deleteNote();
  };
  const handleModification = (event) => {
    modifyNote(event.target.value);
  };
  return (
    <div className="note-card">
      {isEditing ? (
        <textarea
          className="note-content"
          value={content}
          onChange={handleModification}
        />
      ) : (
        <div className="note-content">{content}</div>
      )}
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
};

export default Note;
