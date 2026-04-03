import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/UI';
import { Colors, Spacing, Radii, Typography, Shadows } from '../utils/theme';
import { CATEGORIES, NoteCategory } from '../utils/types';

export default function HomeScreen() {
  const router = useRouter();
  const {
    filteredNotes,
    filter,
    setFilter,
    toggleFavorite,
    togglePin,
    stats,
    isLoading,
  } = useNotes();
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      setFilter({ ...filter, search: text || undefined });
    },
    [filter, setFilter]
  );

  const handleCategoryFilter = (cat?: NoteCategory) => {
    setFilter({ ...filter, category: cat });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 6) return { text: 'Bonne nuit 🌙', sub: 'Tout est tranquille' };
    if (h < 12) return { text: 'Bonjour ☀️', sub: 'Belle journée en perspective !' };
    if (h < 17) return { text: 'Bon après-midi 🌤', sub: 'Comment ça se passe ?' };
    if (h < 21) return { text: 'Bonsoir 🌆', sub: 'La journée se termine bien ?' };
    return { text: 'Bonne soirée 🌃', sub: 'Il est temps de se détendre' };
  };

  const { text: greetText, sub: greetSub } = greeting();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg1} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greetText}</Text>
          <Text style={styles.greetingSub}>{greetSub}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.profileEmoji}>🌸</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsRow}
      >
        <StatPill emoji="📝" label="Notes" count={stats.total} color={Colors.primary} />
        <StatPill emoji="📌" label="Épinglées" count={stats.pinned} color={Colors.warning} />
        <StatPill emoji="❤️" label="Favoris" count={stats.favorites} color="#EC4899" />
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher vos notes..."
          placeholderTextColor={Colors.textMuted}
          value={searchText}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <CategoryChip
          emoji="✨"
          label="Tout"
          active={!filter.category}
          onPress={() => handleCategoryFilter(undefined)}
          color={Colors.primary}
        />
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.key}
            emoji={cat.emoji}
            label={cat.label}
            active={filter.category === cat.key}
            onPress={() =>
              handleCategoryFilter(
                filter.category === cat.key ? undefined : cat.key
              )
            }
            color={cat.color}
            count={stats.byCategory[cat.key]}
          />
        ))}
      </ScrollView>

      {/* Quick filters row */}
      <View style={styles.quickFilters}>
        <TouchableOpacity
          style={[
            styles.quickFilter,
            filter.showFavorites && { backgroundColor: '#EC4899' + '33' },
          ]}
          onPress={() =>
            setFilter({ ...filter, showFavorites: !filter.showFavorites })
          }
        >
          <Text style={styles.quickFilterText}>
            {filter.showFavorites ? '❤️' : '🤍'} Favoris
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.quickFilter,
            filter.showArchived && { backgroundColor: Colors.textMuted + '33' },
          ]}
          onPress={() =>
            setFilter({ ...filter, showArchived: !filter.showArchived })
          }
        >
          <Text style={styles.quickFilterText}>
            📦 Archivées
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => router.push(`/note/${item.id}`)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onTogglePin={() => togglePin(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            emoji={searchText ? '🔍' : '📭'}
            title={searchText ? 'Aucun résultat' : 'Aucune note'}
            subtitle={
              searchText
                ? `Aucune note pour "${searchText}"`
                : 'Appuyez sur + pour créer votre première note !'
            }
            action={
              !searchText
                ? {
                    label: '✨ Créer une note',
                    onPress: () => router.push('/new-note'),
                  }
                : undefined
            }
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/new-note')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatPill({
  emoji,
  label,
  count,
  color,
}: {
  emoji: string;
  label: string;
  count: number;
  color: string;
}) {
  return (
    <View style={[styles.statPill, { borderColor: color + '44' }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statCount, { color }]}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CategoryChip({
  emoji,
  label,
  active,
  onPress,
  color,
  count,
}: {
  emoji: string;
  label: string;
  active: boolean;
  onPress: () => void;
  color: string;
  count?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: color, ...Shadows.glow(color + '55') },
      ]}
      activeOpacity={0.75}
    >
      <Text style={styles.chipEmoji}>{emoji}</Text>
      <Text style={[styles.chipLabel, active && { color: Colors.white }]}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <View style={[styles.chipCount, active && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
          <Text style={[styles.chipCountText, active && { color: Colors.white }]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  greeting: {
    ...Typography.displayMD,
    color: Colors.text,
  },
  greetingSub: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryLight + '44',
  },
  profileEmoji: {
    fontSize: 22,
  },
  statsRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: 10,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg2,
    borderRadius: Radii.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 6,
  },
  statEmoji: {
    fontSize: 14,
  },
  statCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg3,
    borderRadius: Radii.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMD,
    color: Colors.text,
  },
  filterRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg3,
    borderRadius: Radii.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipLabel: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  chipCount: {
    backgroundColor: Colors.bg4,
    borderRadius: Radii.full,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  chipCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  quickFilters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  quickFilter: {
    backgroundColor: Colors.bg3,
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickFilterText: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingBottom: 120,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: Spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow(Colors.primaryGlow),
    ...Shadows.lg,
  },
});
