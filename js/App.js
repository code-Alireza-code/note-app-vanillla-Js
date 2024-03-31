import NoteAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

class App {
  constructor(root) {
    this.root = root;
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this.handlers());
    this.refreshNotes();
  }

  handlers() {
    return {
      onNoteAdd: () => {
        const newNote = {
          title: "",
          body: "",
        };
        NoteAPI.saveNote(newNote);
        this.refreshNotes();
      },

      onNoteEdit: (title, body) => {
        NoteAPI.saveNote({
          id: this.activeNote.id,
          title,
          body,
        });
        this.refreshNotes();
      },

      onNoteSelect: (id) => {
        const selectedNote = NoteAPI.getAllNotes().find(
          (note) => note.id == id
        );
        this.setActiveNote(selectedNote);
      },

      onNoteDelete: (e, id) => {
        e.stopPropagation();
        NoteAPI.deleteNote(id);

        this.refreshNotes();
      },
    };
  }

  refreshNotes() {
    // get all notes
    const notes = NoteAPI.getAllNotes();

    this.setNotes(notes);
    if (notes.length > 0) {
      this.setActiveNote(notes[0]);
    }
  }

  setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }
  setNotes(notes) {
    // set notes
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }
}
export default App;
