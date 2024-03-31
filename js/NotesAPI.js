class NoteAPI {
  static getAllNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes-app")) || [];
    return savedNotes.sort((a, b) =>
      new Date(a.updated) > new Date(b.updated) ? -1 : 1
    );
  }

  static saveNote(noteToSave) {
    // existes or not ...?
    const notes = this.getAllNotes();
    const existedNote = notes.find((n) => n.id == noteToSave.id);

    if (existedNote) {
      existedNote.title = noteToSave.title;
      existedNote.body = noteToSave.body;
    } else {
      noteToSave.id = new Date().getTime();
      noteToSave.updated = new Date().toISOString();
      notes.push(noteToSave);
    }
    this.saveAllNotes(notes);
  }

  static saveAllNotes(notes) {
    localStorage.setItem("notes-app", JSON.stringify(notes));
  }

  static deleteNote(id) {
    const filteredNotes = this.getAllNotes().filter((n) => n.id != id);
    this.saveAllNotes(filteredNotes);
  }
}
export default NoteAPI;
