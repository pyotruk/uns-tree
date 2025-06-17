import { makeObservable, observable, computed } from 'mobx';
import { NoteProps } from './NoteProps';

const API_URL = 'http://localhost:3033';
const HTTP_HEADERS = {
  'Content-Type': 'application/json',
};

class NotesStore {
  _notes: NoteProps[] = [];

  private async fetchNotes(): Promise<void> {
    try {
      const response: Response = await fetch(`${API_URL}/notes`);
      this._notes = await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  constructor() {
    this.postNote = this.postNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    makeObservable(this, {
      _notes: observable,
      notes: computed,
    });

    this.fetchNotes();
  }

  get notes() {
    return this._notes;
  }

  async postNote(text: string): Promise<void> {
    try {
      const response: Response = await fetch(`${API_URL}/note`, {
        method: 'POST',
        headers: HTTP_HEADERS,
        body: JSON.stringify({ text }),
      });
      const note: NoteProps = await response.json();
      this._notes.push(note);
    } catch (err) {
      console.error(err);
      alert('Failed to post the note.');
    }
  }

  async updateNote(id: number, text: string): Promise<void> {
    try {
      await fetch(`${API_URL}/note`, {
        method: 'PUT',
        headers: HTTP_HEADERS,
        body: JSON.stringify({ id, text }),
      });
      this._notes.find(note => note.id === id)!.text = text;
    } catch (err) {
      console.error(err);
      alert('Failed to update the note.');
    }
  }

  async deleteNote(id: number): Promise<void> {
    try {
      await fetch(`${API_URL}/note`, {
        method: 'DELETE',
        headers: HTTP_HEADERS,
        body: JSON.stringify({ id }),
      });
      this._notes = this._notes.filter((note: NoteProps) => note.id !== id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete the note.');
    }
  }
}

export default NotesStore;
