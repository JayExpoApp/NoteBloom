import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Note, NoteFilter, NoteCategory, Priority } from '../utils/types';
import { StorageService } from '../utils/storage';

// Demo notes to pre-populate on first launch
const DEMO_NOTES: Note[] = [
  {
    id: 'demo-1',
    title: 'Refonte site web 🚀',
    content: 'Planification complète de la refonte du site d\'entreprise avec nouveau design et meilleures performances.',
    category: 'project',
    priority: 'high',
    color: '#7C3AED',
    emoji: '🚀',
    checklist: [
      { id: 'c1', text: 'Analyse des besoins', checked: true, emoji: '✅' },
      { id: 'c2', text: 'Maquettes Figma', checked: true, emoji: '🎨' },
      { id: 'c3', text: 'Développement frontend', checked: false, emoji: '💻' },
      { id: 'c4', text: 'Tests utilisateurs', checked: false, emoji: '🧪' },
      { id: 'c5', text: 'Mise en ligne', checked: false, emoji: '🌐' },
    ],
    tags: ['web', 'design', 'urgent'],
    isPinned: true,
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    progress: 40,
  },
  {
    id: 'demo-2',
    title: 'Courses du week-end 🛒',
    content: 'Liste pour le dîner de dimanche avec la famille.',
    category: 'shopping',
    priority: 'medium',
    color: '#F97316',
    emoji: '🛒',
    checklist: [
      { id: 's1', text: 'Tomates 🍅 × 6', checked: true },
      { id: 's2', text: 'Pâtes × 2 paquets', checked: true },
      { id: 's3', text: 'Parmesan', checked: false },
      { id: 's4', text: 'Vin rouge 🍷', checked: false },
      { id: 's5', text: 'Pain frais 🥖', checked: false },
      { id: 's6', text: 'Crème fraîche', checked: false },
    ],
    tags: ['nourriture', 'famille'],
    isPinned: false,
    isFavorite: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'RDV Dentiste 📅',
    content: 'Contrôle annuel + détartrage. Apporter la carte vitale et la mutuelle.',
    category: 'appointment',
    priority: 'high',
    color: '#10B981',
    emoji: '😁',
    checklist: [
      { id: 'a1', text: 'Carte vitale', checked: false },
      { id: 'a2', text: 'Carte mutuelle', checked: false },
      { id: 'a3', text: 'Ordonnance précédente', checked: true },
    ],
    tags: ['santé', 'médecin'],
    isPinned: false,
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    reminder: new Date(Date.now() + 86400000 * 4).toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Apprendre le piano 🎵',
    content: 'Progression semaine par semaine pour maîtriser les bases du piano classique.',
    category: 'process',
    priority: 'low',
    color: '#3B82F6',
    emoji: '🎹',
    checklist: [
      { id: 'p1', text: 'Semaine 1 : Posture & notes', checked: true },
      { id: 'p2', text: 'Semaine 2 : Gamme de Do', checked: true },
      { id: 'p3', text: 'Semaine 3 : Accords de base', checked: true },
      { id: 'p4', text: 'Semaine 4 : Première mélodie', checked: false },
      { id: 'p5', text: 'Semaine 5 : Mains ensemble', checked: false },
      { id: 'p6', text: 'Semaine 6 : Morceau complet', checked: false },
    ],
    tags: ['musique', 'apprentissage'],
    isPinned: false,
    isFavorite: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    progress: 50,
  },
  {
    id: 'demo-5',
    title: 'Vacances à Barcelone ✈️',
    content: 'Voyage prévu en juin ! Tout ce qu\'il faut voir et faire.',
    category: 'travel',
    priority: 'medium',
    color: '#06B6D4',
    emoji: '🌊',
    checklist: [
      { id: 't1', text: 'Réserver l\'hôtel', checked: true },
      { id: 't2', text: 'Billets d\'avion', checked: true },
      { id: 't3', text: 'Sagrada Família', checked: false },
      { id: 't4', text: 'Las Ramblas', checked: false },
      { id: 't5', text: 'Plage Barceloneta', checked: false },
      { id: 't6', text: 'Parc Güell', checked: false },
    ],
    tags: ['voyage', 'espagne', 'été'],
    isPinned: false,
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    progress: 33,
  },
];

interface NotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  filter: NoteFilter;
  isLoading: boolean;
  setFilter: (f: NoteFilter) => void;
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  toggleChecklistItem: (noteId: string, itemId: string) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
  stats: {
    total: number;
    pinned: number;
    favorites: number;
    byCategory: Record<NoteCategory, number>;
  };
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<NoteFilter>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await StorageService.getNotes();
      if (stored.length === 0) {
        await StorageService.saveNotes(DEMO_NOTES);
        setNotes(DEMO_NOTES);
      } else {
        setNotes(stored);
      }
      setIsLoading(false);
    })();
  }, []);

  const filteredNotes = notes.filter((n) => {
    if (!filter.showArchived && n.isArchived) return false;
    if (filter.showFavorites && !n.isFavorite) return false;
    if (filter.category && n.category !== filter.category) return false;
    if (filter.priority && n.priority !== filter.priority) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sort: pinned first, then by updatedAt
  const sorted = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const addNote = useCallback(async (note: Note) => {
    const updated = await StorageService.addNote(note);
    setNotes(updated);
  }, []);

  const updateNote = useCallback(async (note: Note) => {
    const updated = await StorageService.updateNote({
      ...note,
      updatedAt: new Date().toISOString(),
    });
    setNotes(updated);
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const updated = await StorageService.deleteNote(id);
    setNotes(updated);
  }, []);

  const togglePin = useCallback(async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    await updateNote({ ...note, isPinned: !note.isPinned });
  }, [notes, updateNote]);

  const toggleFavorite = useCallback(async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    await updateNote({ ...note, isFavorite: !note.isFavorite });
  }, [notes, updateNote]);

  const toggleArchive = useCallback(async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    await updateNote({ ...note, isArchived: !note.isArchived });
  }, [notes, updateNote]);

  const toggleChecklistItem = useCallback(
    async (noteId: string, itemId: string) => {
      const note = notes.find((n) => n.id === noteId);
      if (!note) return;
      const checklist = note.checklist.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      const checked = checklist.filter((i) => i.checked).length;
      const progress = checklist.length > 0
        ? Math.round((checked / checklist.length) * 100)
        : 0;
      await updateNote({ ...note, checklist, progress });
    },
    [notes, updateNote]
  );

  const getNoteById = useCallback(
    (id: string) => notes.find((n) => n.id === id),
    [notes]
  );

  const stats = {
    total: notes.filter((n) => !n.isArchived).length,
    pinned: notes.filter((n) => n.isPinned && !n.isArchived).length,
    favorites: notes.filter((n) => n.isFavorite && !n.isArchived).length,
    byCategory: notes.reduce((acc, n) => {
      if (!n.isArchived) acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {} as Record<NoteCategory, number>),
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes: sorted,
        filter,
        isLoading,
        setFilter,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        toggleFavorite,
        toggleArchive,
        toggleChecklistItem,
        getNoteById,
        stats,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
