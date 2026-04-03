import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotes } from '../context/NotesContext';
import { Colors, Spacing, Radii, Typography, Shadows } from '../utils/theme';
import { CATEGORIES } from '../utils/types';
import { ProgressBar } from '../components/UI';

export default function SettingsScreen() {
  const router = useRouter();
  const { notes, stats, deleteNote } = useNotes();

  const archivedCount = notes.filter((n) => n.isArchived).length;

  const handleClearArchive = () => {
    const archived = notes.filter((n) => n.isArchived);
    if (archived.length === 0) {
      Alert.alert('Archive vide', 'Aucune note archivée à supprimer.');
      return;
    }
    Alert.alert(
      'Vider l\'archive ?',
      `${archived.length} note(s) seront définitivement supprimées.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer tout',
          style: 'destructive',
          onPress: async () => {
            for (const note of archived) {
              await deleteNote(note.id);
            }
            Alert.alert('✅ Archive vidée !');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>⚙️ Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>🌸</Text>
          <Text style={styles.profileName}>NoteBloom</Text>
          <Text style={styles.profileSub}>Votre carnet de notes intelligent</Text>

          {/* Quick stats */}
          <View style={styles.statsGrid}>
            <StatBox emoji="📝" label="Notes" value={stats.total} />
            <StatBox emoji="📌" label="Épinglées" value={stats.pinned} />
            <StatBox emoji="❤️" label="Favoris" value={stats.favorites} />
            <StatBox emoji="📦" label="Archivées" value={archivedCount} />
          </View>
        </View>

        {/* Categories breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Par catégorie</Text>
          {CATEGORIES.map((cat) => {
            const count = stats.byCategory[cat.key] ?? 0;
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <View key={cat.key} style={styles.catRow}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <View style={styles.catInfo}>
                  <View style={styles.catHeader}>
                    <Text style={styles.catLabel}>{cat.label}</Text>
                    <Text style={[styles.catCount, { color: cat.color }]}>{count}</Text>
                  </View>
                  <ProgressBar progress={pct} color={cat.color} height={4} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Actions</Text>

          <SettingRow
            emoji="📦"
            label="Voir les archives"
            sub={`${archivedCount} note(s) archivée(s)`}
            onPress={() => router.back()}
          />
          <SettingRow
            emoji="🗑️"
            label="Vider l'archive"
            sub="Suppression définitive"
            onPress={handleClearArchive}
            danger
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              🌸 NoteBloom v1.0.0{'\n\n'}
              Une application de notes moderne et intuitive.{'\n\n'}
              Gérez vos projets, courses, rendez-vous et bien plus encore !
            </Text>
          </View>

          <View style={styles.featureList}>
            {[
              '📝 Notes richement formatées',
              '✅ Listes de tâches avec progression',
              '📂 8 catégories personnalisées',
              '🎨 Couleurs & emojis',
              '🔍 Recherche instantanée',
              '📌 Épinglage & favoris',
              '📦 Archivage',
              '📤 Partage facile',
            ].map((feat) => (
              <View key={feat} style={styles.featureItem}>
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ emoji, label, value }: { emoji: string; label: string; value: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({
  emoji,
  label,
  sub,
  onPress,
  danger,
}: {
  emoji: string;
  label: string;
  sub?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIcon, danger && { backgroundColor: Colors.danger + '22' }]}>
        <Text style={styles.settingEmoji}>{emoji}</Text>
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, danger && { color: Colors.danger }]}>{label}</Text>
        {sub && <Text style={styles.settingSub}>{sub}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
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
    justifyContent: 'space-between',
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
  navTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  profileCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.bg2,
    borderRadius: Radii.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileEmoji: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  profileName: {
    ...Typography.displayMD,
    color: Colors.text,
    marginBottom: 4,
  },
  profileSub: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.bg3,
    borderRadius: Radii.lg,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: {
    fontSize: 18,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.bg2,
    borderRadius: Radii.xxl,
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
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  catEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  catInfo: {
    flex: 1,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catLabel: {
    ...Typography.bodyMD,
    color: Colors.text,
  },
  catCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingEmoji: {
    fontSize: 18,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...Typography.bodyMD,
    color: Colors.text,
  },
  settingSub: {
    ...Typography.bodySM,
    color: Colors.textMuted,
    marginTop: 1,
  },
  aboutCard: {
    backgroundColor: Colors.bg3,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  aboutText: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  featureList: {
    gap: 6,
  },
  featureItem: {
    backgroundColor: Colors.bg3,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureText: {
    ...Typography.bodyMD,
    color: Colors.text,
  },
});
