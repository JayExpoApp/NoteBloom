import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotes } from '../context/NotesContext';
import { Colors, Spacing, Radii, Typography, Shadows } from '../utils/theme';
import {
  Note,
  ChecklistItem,
  NoteCategory,
  Priority,
  CATEGORIES,
  PRIORITY_CONFIG,
  NOTE_COLORS,
  NOTE_EMOJIS,
} from '../utils/types';
import { ProgressBar } from '../components/UI';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


export default function NoteEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getNoteById, addNote, updateNote, deleteNote } = useNotes();
  const existingNote = id ? getNoteById(id) : undefined;

  const [title, setTitle] = useState(existingNote?.title ?? '');
  const [content, setContent] = useState(existingNote?.content ?? '');
  const [category, setCategory] = useState<NoteCategory>(existingNote?.category ?? 'personal');
  const [priority, setPriority] = useState<Priority>(existingNote?.priority ?? 'medium');
  const [color, setColor] = useState(existingNote?.color ?? Colors.primary);
  const [emoji, setEmoji] = useState(existingNote?.emoji ?? '📝');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    existingNote?.checklist ?? []
  );
  const [tags, setTags] = useState<string[]>(existingNote?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newCheckText, setNewCheckText] = useState('');
  const [activeTab, setActiveTab] = useState<'note' | 'checklist' | 'details'>('note');

  const titleRef = useRef<TextInput>(null);

  const progress = checklist.length > 0
    ? Math.round((checklist.filter((i) => i.checked).length / checklist.length) * 100)
    : 0;

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Veuillez saisir un titre pour la note.');
      titleRef.current?.focus();
      return;
    }
    const now = new Date().toISOString();
    const note: Note = {
      id: existingNote?.id ?? uuidv4(),
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      color,
      emoji,
      checklist,
      tags,
      isPinned: existingNote?.isPinned ?? false,
      isFavorite: existingNote?.isFavorite ?? false,
      isArchived: existingNote?.isArchived ?? false,
      createdAt: existingNote?.createdAt ?? now,
      updatedAt: now,
      progress,
    };
    if (existingNote) {
      await updateNote(note);
    } else {
      await addNote(note);
    }
    router.back();
  }, [title, content, category, priority, color, emoji, checklist, tags, progress, existingNote]);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la note ?',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            if (existingNote) {
              await deleteNote(existingNote.id);
            }
            router.back();
          },
        },
      ]
    );
  };

  const addChecklistItem = () => {
    if (!newCheckText.trim()) return;
    const item: ChecklistItem = {
      id: uuidv4(),
      text: newCheckText.trim(),
      checked: false,
    };
    setChecklist([...checklist, item]);
    setNewCheckText('');
  };

  const toggleCheckItem = (itemId: string) => {
    setChecklist(checklist.map((i) =>
      i.id === itemId ? { ...i, checked: !i.checked } : i
    ));
  };

  const deleteCheckItem = (itemId: string) => {
    setChecklist(checklist.filter((i) => i.id !== itemId));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const catConfig = CATEGORIES.find((c) => c.key === category)!;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Nav bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          {existingNote ? '✏️ Modifier' : '✨ Nouvelle note'}
        </Text>
        <View style={styles.navRight}>
          {existingNote && (
            <TouchableOpacity onPress={handleDelete} style={styles.navBtn}>
              <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: color }]}
          >
            <Text style={styles.saveBtnText}>Sauver</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Note header area */}
          <View style={[styles.noteHeader, { borderBottomColor: color + '44' }]}>
            {/* Emoji + Color pickers */}
            <View style={styles.emojiColorRow}>
              <TouchableOpacity
                style={[styles.emojiPicker, { backgroundColor: color + '22', borderColor: color + '55' }]}
                onPress={() => setShowEmojiPicker(true)}
              >
                <Text style={styles.mainEmoji}>{emoji}</Text>
              </TouchableOpacity>
              <View style={styles.colorDots}>
                {NOTE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      color === c && styles.colorDotActive,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>
            </View>

            {/* Title */}
            <TextInput
              ref={titleRef}
              style={styles.titleInput}
              placeholder="Titre de la note..."
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
              multiline
              returnKeyType="next"
            />
          </View>

          {/* Tab selector */}
          <View style={styles.tabs}>
            {(['note', 'checklist', 'details'] as const).map((tab) => {
              const labels = { note: '📝 Note', checklist: '✅ Liste', details: '⚙️ Détails' };
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && { borderBottomColor: color }]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && { color: color }]}>
                    {labels[tab]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── NOTE TAB ── */}
          {activeTab === 'note' && (
            <View style={styles.tabContent}>
              <TextInput
                style={styles.contentInput}
                placeholder="Écrivez votre note ici... 💭"
                placeholderTextColor={Colors.textMuted}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}

          {/* ── CHECKLIST TAB ── */}
          {activeTab === 'checklist' && (
            <View style={styles.tabContent}>
              {/* Progress */}
              {checklist.length > 0 && (
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>
                      {checklist.filter((i) => i.checked).length}/{checklist.length} complétés
                    </Text>
                    <Text style={[styles.progressPct, { color }]}>{progress}%</Text>
                  </View>
                  <ProgressBar progress={progress} color={color} height={8} />
                </View>
              )}

              {/* Items */}
              {checklist.map((item, idx) => (
                <View key={item.id} style={styles.checklistItem}>
                  <TouchableOpacity
                    style={[
                      styles.checkBox,
                      item.checked && { backgroundColor: color, borderColor: color },
                    ]}
                    onPress={() => toggleCheckItem(item.id)}
                  >
                    {item.checked && (
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.checkItemText,
                      item.checked && styles.checkItemDone,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteCheckItem(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add item row */}
              <View style={styles.addCheckRow}>
                <Ionicons name="add-circle" size={22} color={color} />
                <TextInput
                  style={styles.addCheckInput}
                  placeholder="Ajouter un élément..."
                  placeholderTextColor={Colors.textMuted}
                  value={newCheckText}
                  onChangeText={setNewCheckText}
                  onSubmitEditing={addChecklistItem}
                  returnKeyType="done"
                />
                {newCheckText.length > 0 && (
                  <TouchableOpacity onPress={addChecklistItem} style={[styles.addBtn, { backgroundColor: color }]}>
                    <Text style={styles.addBtnText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* ── DETAILS TAB ── */}
          {activeTab === 'details' && (
            <View style={styles.tabContent}>
              {/* Category */}
              <Text style={styles.sectionLabel}>📂 Catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.optionChip,
                      category === cat.key && {
                        backgroundColor: cat.color,
                        borderColor: cat.color,
                      },
                    ]}
                    onPress={() => {
                      setCategory(cat.key);
                      setColor(cat.color);
                    }}
                  >
                    <Text style={styles.optionEmoji}>{cat.emoji}</Text>
                    <Text style={[
                      styles.optionLabel,
                      category === cat.key && { color: Colors.white },
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Priority */}
              <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>🎯 Priorité</Text>
              <View style={styles.priorityRow}>
                {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityBtn,
                        priority === p && { backgroundColor: cfg.color, borderColor: cfg.color },
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <Text>{cfg.emoji}</Text>
                      <Text style={[
                        styles.priorityLabel,
                        priority === p && { color: Colors.white },
                      ]}>
                        {cfg.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Tags */}
              <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>🏷️ Tags</Text>
              <View style={styles.tagsRow}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, { borderColor: color + '66' }]}
                    onPress={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    <Text style={[styles.tagText, { color }]}>#{tag}</Text>
                    <Ionicons name="close" size={12} color={color} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.tagInputRow}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Ajouter un tag..."
                  placeholderTextColor={Colors.textMuted}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  returnKeyType="done"
                />
                {tagInput.length > 0 && (
                  <TouchableOpacity onPress={addTag} style={[styles.addBtn, { backgroundColor: color }]}>
                    <Text style={styles.addBtnText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Emoji Picker Modal */}
      <Modal visible={showEmojiPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowEmojiPicker(false)}
        />
        <View style={styles.emojiSheet}>
          <Text style={styles.sheetTitle}>Choisir un emoji</Text>
          <FlatList
            data={NOTE_EMOJIS}
            keyExtractor={(item) => item}
            numColumns={8}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.emojiOption}
                onPress={() => {
                  setEmoji(item);
                  setShowEmojiPicker(false);
                }}
              >
                <Text style={styles.emojiOptionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.md,
  },
  navTitle: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.full,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  noteHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  emojiColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  emojiPicker: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainEmoji: {
    fontSize: 28,
  },
  colorDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  colorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  colorDotActive: {
    borderWidth: 2.5,
    borderColor: Colors.white,
    transform: [{ scale: 1.15 }],
  },
  titleInput: {
    ...Typography.displayMD,
    color: Colors.text,
    padding: 0,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.transparent,
  },
  tabText: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  tabContent: {
    padding: Spacing.lg,
  },
  contentInput: {
    ...Typography.bodyLG,
    color: Colors.text,
    minHeight: 200,
    textAlignVertical: 'top',
    lineHeight: 26,
    padding: 0,
  },
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  progressPct: {
    ...Typography.labelMD,
    fontWeight: '800',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkItemText: {
    ...Typography.bodyMD,
    color: Colors.text,
    flex: 1,
  },
  checkItemDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  addCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Spacing.md,
  },
  addCheckInput: {
    flex: 1,
    ...Typography.bodyMD,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  sectionLabel: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  optionScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg3,
    borderRadius: Radii.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionLabel: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg3,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priorityLabel: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    borderWidth: 1,
    backgroundColor: Colors.bg3,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagInput: {
    flex: 1,
    ...Typography.bodyMD,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  emojiSheet: {
    backgroundColor: Colors.bg2,
    borderTopLeftRadius: Radii.xxl,
    borderTopRightRadius: Radii.xxl,
    padding: Spacing.lg,
    maxHeight: '50%',
  },
  sheetTitle: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emojiOption: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  emojiOptionText: {
    fontSize: 26,
  },
});
