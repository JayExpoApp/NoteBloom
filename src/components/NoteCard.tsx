import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note, CATEGORIES, PRIORITY_CONFIG } from '../utils/types';
import { Colors, Spacing, Radii, Typography, Shadows } from '../utils/theme';
import { ProgressBar, Badge } from './UI';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
  onToggleFavorite?: () => void;
  onTogglePin?: () => void;
}

export function NoteCard({
  note,
  onPress,
  onLongPress,
  onToggleFavorite,
  onTogglePin,
}: NoteCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const category = CATEGORIES.find((c) => c.key === note.category);
  const priority = PRIORITY_CONFIG[note.priority];
  const checkedCount = note.checklist.filter((i) => i.checked).length;
  const totalCount = note.checklist.length;
  const hasChecklist = totalCount > 0;
  const progress = note.progress ?? (hasChecklist ? Math.round((checkedCount / totalCount) * 100) : 0);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const displayDate = format(new Date(note.updatedAt), 'd MMM', { locale: fr });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          {
            borderLeftWidth: 3,
            borderLeftColor: note.color,
          },
          note.isPinned && styles.pinnedCard,
        ]}
      >
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{note.emoji}</Text>
          </View>
          <View style={styles.titleArea}>
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaDate}>{displayDate}</Text>
              {note.dueDate && (
                <View style={styles.dueBadge}>
                  <Text style={styles.dueText}>
                    📅 {format(new Date(note.dueDate), 'd MMM', { locale: fr })}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.actions}>
            {note.isPinned && (
              <Ionicons name="pin" size={14} color={note.color} style={styles.pinIcon} />
            )}
            <TouchableOpacity
              onPress={onToggleFavorite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={note.isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={note.isFavorite ? '#EC4899' : Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content preview */}
        {note.content ? (
          <Text style={styles.content} numberOfLines={2}>
            {note.content}
          </Text>
        ) : null}

        {/* Checklist preview */}
        {hasChecklist && (
          <View style={styles.checklistPreview}>
            {note.checklist.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.checkItem}>
                <View
                  style={[
                    styles.checkBox,
                    item.checked && { backgroundColor: note.color, borderColor: note.color },
                  ]}
                >
                  {item.checked && (
                    <Ionicons name="checkmark" size={10} color={Colors.white} />
                  )}
                </View>
                <Text
                  style={[styles.checkText, item.checked && styles.checkTextDone]}
                  numberOfLines={1}
                >
                  {item.text}
                </Text>
              </View>
            ))}
            {totalCount > 3 && (
              <Text style={styles.moreItems}>+{totalCount - 3} de plus</Text>
            )}
          </View>
        )}

        {/* Progress bar */}
        {(hasChecklist || note.progress !== undefined) && (
          <View style={styles.progressRow}>
            <ProgressBar progress={progress} color={note.color} height={4} />
            <Text style={[styles.progressText, { color: note.color }]}>
              {progress}%
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {category && (
              <Badge label={category.label} color={note.color} emoji={category.emoji} />
            )}
            {note.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} label={`#${tag}`} color={Colors.textMuted} />
            ))}
          </View>
          <View style={styles.priorityDot}>
            <Text style={{ fontSize: 12 }}>{priority.emoji}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg2,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadows.md,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  pinnedCard: {
    backgroundColor: Colors.bg3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  emojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  emoji: {
    fontSize: 20,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDate: {
    ...Typography.bodySM,
    color: Colors.textMuted,
  },
  dueBadge: {
    backgroundColor: Colors.warning + '22',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.full,
  },
  dueText: {
    fontSize: 10,
    color: Colors.warning,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinIcon: {
    marginRight: 2,
  },
  content: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  checklistPreview: {
    marginBottom: Spacing.sm,
    gap: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    flex: 1,
  },
  checkTextDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  moreItems: {
    ...Typography.bodySM,
    color: Colors.textMuted,
    marginLeft: 24,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  footerLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  priorityDot: {
    marginLeft: 8,
  },
});
