import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNotes } from '../context/NotesContext';
import { Colors, Spacing, Radii, Typography, Shadows } from '../utils/theme';
import { CATEGORIES, PRIORITY_CONFIG } from '../utils/types';
import { ProgressBar, Badge } from '../components/UI';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getNoteById,
    toggleChecklistItem,
    toggleFavorite,
    togglePin,
    toggleArchive,
    deleteNote,
  } = useNotes();

  const note = getNoteById(id);

  if (!note) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>😕</Text>
          <Text style={styles.notFoundText}>Note introuvable</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const category = CATEGORIES.find((c) => c.key === note.category)!;
  const priority = PRIORITY_CONFIG[note.priority];
  const checkedCount = note.checklist.filter((i) => i.checked).length;
  const progress = note.checklist.length > 0
    ? Math.round((checkedCount / note.checklist.length) * 100)
    : note.progress ?? 0;

  const handleShare = async () => {
    const checklistText = note.checklist.length > 0
      ? '\n\n✅ Liste:\n' + note.checklist.map((i) =>
          `${i.checked ? '☑' : '☐'} ${i.text}`
        ).join('\n')
      : '';
    await Share.share({
      title: note.title,
      message: `${note.emoji} ${note.title}\n\n${note.content}${checklistText}`,
    });
  };

  const handleDelete = () => {
    Alert.alert('Supprimer ?', 'Cette note sera définitivement supprimée.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.navActions}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => togglePin(note.id)}
          >
            <Ionicons
              name={note.isPinned ? 'pin' : 'pin-outline'}
              size={20}
              color={note.isPinned ? note.color : Colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => toggleFavorite(note.id)}
          >
            <Ionicons
              name={note.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={note.isFavorite ? '#EC4899' : Colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push(`/edit-note/${note.id}`)}
          >
            <Ionicons name="create-outline" size={20} color={note.color} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={[styles.hero, { backgroundColor: note.color + '15' }]}>
          <View style={[styles.heroEmoji, { backgroundColor: note.color + '30' }]}>
            <Text style={styles.heroEmojiText}>{note.emoji}</Text>
          </View>
          <Text style={styles.title}>{note.title}</Text>

          {/* Meta badges */}
          <View style={styles.badges}>
            <Badge label={category.label} color={note.color} emoji={category.emoji} />
            <Badge label={priority.label} color={priority.color} emoji={priority.emoji} />
            {note.isPinned && <Badge label="Épinglée" color={Colors.warning} emoji="📌" />}
            {note.isFavorite && <Badge label="Favori" color="#EC4899" emoji="❤️" />}
          </View>

          {/* Date info */}
          <Text style={styles.dateInfo}>
            🕐 Modifiée le {format(new Date(note.updatedAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
          </Text>
          {note.dueDate && (
            <Text style={styles.dateInfo}>
              📅 Échéance : {format(new Date(note.dueDate), 'd MMMM yyyy', { locale: fr })}
            </Text>
          )}
        </View>

        {/* Content */}
        {note.content ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Note</Text>
            <Text style={styles.content}>{note.content}</Text>
          </View>
        ) : null}

        {/* Checklist */}
        {note.checklist.length > 0 && (
          <View style={styles.section}>
            <View style={styles.checklistHeader}>
              <Text style={styles.sectionTitle}>✅ Liste de tâches</Text>
              <Text style={[styles.checklistCount, { color: note.color }]}>
                {checkedCount}/{note.checklist.length}
              </Text>
            </View>
            <View style={styles.progressRow}>
              <ProgressBar progress={progress} color={note.color} height={8} style={{ flex: 1 }} />
              <Text style={[styles.progressPct, { color: note.color }]}>{progress}%</Text>
            </View>
            {note.checklist.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checkItem}
                onPress={() => toggleChecklistItem(note.id, item.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkBox,
                    item.checked && { backgroundColor: note.color, borderColor: note.color },
                  ]}
                >
                  {item.checked && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </View>
                <Text
                  style={[styles.checkText, item.checked && styles.checkDone]}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tags */}
        {note.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏷️ Tags</Text>
            <View style={styles.tagsRow}>
              {note.tags.map((tag) => (
                <View
                  key={tag}
                  style={[styles.tagChip, { borderColor: note.color + '55' }]}
                >
                  <Text style={[styles.tagText, { color: note.color }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleArchive(note.id)}
          >
            <Ionicons
              name={note.isArchived ? 'archive' : 'archive-outline'}
              size={20}
              color={Colors.textSecondary}
            />
            <Text style={styles.actionBtnText}>
              {note.isArchived ? 'Désarchiver' : 'Archiver'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.dangerBtn]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            <Text style={[styles.actionBtnText, { color: Colors.danger }]}>Supprimer</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: note.color }]}
        onPress={() => router.push(`/edit-note/${note.id}`)}
      >
        <Ionicons name="create" size={26} color={Colors.white} />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
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
  },
  navActions: {
    flexDirection: 'row',
  },
  scroll: {
    flex: 1,
  },
  hero: {
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heroEmoji: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroEmojiText: {
    fontSize: 40,
  },
  title: {
    ...Typography.displayMD,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  dateInfo: {
    ...Typography.bodySM,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.bg2,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.labelLG,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    ...Typography.bodyLG,
    color: Colors.text,
    lineHeight: 26,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  checklistCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '800',
    minWidth: 36,
    textAlign: 'right',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    ...Typography.bodyMD,
    color: Colors.text,
    flex: 1,
  },
  checkDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.bg3,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.bg2,
    borderRadius: Radii.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dangerBtn: {
    borderColor: Colors.danger + '44',
  },
  actionBtnText: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  notFoundText: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 12,
  },
  backLink: {
    ...Typography.bodyMD,
    color: Colors.primary,
  },
});
