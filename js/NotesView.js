class NotesView {
  constructor(root, handlers) {
    this.root = root;
    const { onNoteAdd, onNoteEdit, onNoteSelect, onNoteDelete } = handlers;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteSelect = onNoteSelect;
    this.onNoteDelete = onNoteDelete;

    this.root.innerHTML = `
    <div class="notes__sidebar">
    <div class="notes__logo">Note App</div>
    <div class="notes__list"></div>
    <button class="notes__add">Add Note</button>
    </div>
    <div class="notes__preview">
    <input type="text" class="notes__title" placeholder="...note title" />
    <textarea
      name=""
      class="notes__body"
      placeholder="take some note"
    ></textarea>
  </div>
  `;

    //# select elements...
    const addNoteBtn = this.root.querySelector(".notes__add");
    const inputTitle = this.root.querySelector(".notes__title");
    const inputBody = this.root.querySelector(".notes__body");

    //# events...

    addNoteBtn.addEventListener("click", () => {
      // run add note method
      this.onNoteAdd();
    });

    [inputBody, inputTitle].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const newTitle = inputTitle.value.trim();
        const newBody = inputBody.value.trim();

        this.onNoteEdit(newTitle, newBody);
      });
    });

    //hide notes preview on first loading
    this.updateNotePreviewVisibility(false);
  }

  _createListItemHtml(note) {
    const { title, body, updated, id } = note;
    const maxBodyLength = 50;
    return `
    <div class="notes__list-item" data-note-id="${id}">
      <div class="notes__item-header">
        <div class="notes__small-title">${title}</div>
        <span class="notes__list-trash" data-note-id="${id}">
        <i class="far fa-trash-alt"></i>
        </span>
      </div>
      <div class="notes__small-body">
      ${body.substring(0, maxBodyLength)}
      ${body.length > maxBodyLength ? "..." : ""}</div>
      <div class="notes__small-updated">${new Date(updated).toLocaleString(
        "fa-IR",
        {
          dateStyle: "full",
          timeStyle: "short",
        }
      )}</div>
    </div>`;
  }

  updateNoteList(notes) {
    const notesContainer = this.root.querySelector(".notes__list");
    notesContainer.innerHTML = "";
    let notesList = "";

    for (const note of notes) {
      const html = this._createListItemHtml(note);
      notesList += html;
    }

    notesContainer.innerHTML = notesList;
    notesContainer.querySelectorAll(".notes__list-item").forEach((noteItem) => {
      noteItem.addEventListener("click", () =>
        this.onNoteSelect(noteItem.dataset.noteId)
      );
    });

    notesContainer
      .querySelectorAll(".notes__list-trash")
      .forEach((noteItem) => {
        noteItem.addEventListener("click", (e) =>
          this.onNoteDelete(e, noteItem.dataset.noteId)
        );
      });
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;

    // remove all previously selecteds...
    this.root.querySelectorAll(".notes__list-item").forEach((item) => {
      item.classList.remove("notes__list-item--selected");
    });
    // add selected class:
    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
      .classList.toggle("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}

export default NotesView;
