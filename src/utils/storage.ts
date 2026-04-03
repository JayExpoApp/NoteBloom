import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from './types';

const NOTES_KEY = '@notebloom_notes';
const SETTINGS_KEY = '@notebloom_settings';

export const StorageService = {
  async getNotes(): Promise<Note[]> {
    try {
      const raw = await AsyncStorage.getItem(NOTES_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Note[];
    } catch (e) {
      console.error('getNotes error:', e);
      return [];
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('saveNotes error:', e);
    }
  },

  async addNote(note: Note): Promise<Note[]> {
    const notes = await this.getNotes();
    const updated = [note, ...notes];
    await this.saveNotes(updated);
    return updated;
  },

  async updateNote(updated: Note): Promise<Note[]> {
    const notes = await this.getNotes();
    const list = notes.map((n) => (n.id === updated.id ? updated : n));
    await this.saveNotes(list);
    return list;
  },

  async deleteNote(id: string): Promise<Note[]> {
    const notes = await this.getNotes();
    const list = notes.filter((n) => n.id !== id);
    await this.saveNotes(list);
    return list;
  },

  async getSettings(): Promise<Record<string, unknown>> {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  async saveSetting(key: string, value: unknown): Promise<void> {
    const settings = await this.getSettings();
    await AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ ...settings, [key]: value })
    );
  },
};
