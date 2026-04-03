import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, Radii, Spacing, Shadows } from '../utils/theme';

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  style,
}: ButtonProps) {
  const bg = {
    primary: Colors.primary,
    secondary: Colors.bg4,
    ghost: Colors.transparent,
    danger: Colors.danger,
  }[variant];

  const textColor = {
    primary: Colors.white,
    secondary: Colors.text,
    ghost: Colors.textSecondary,
    danger: Colors.white,
  }[variant];

  const paddingH = { sm: 12, md: 16, lg: 20 }[size];
  const paddingV = { sm: 8, md: 12, lg: 14 }[size];
  const fontSize = { sm: 12, md: 14, lg: 16 }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          opacity: disabled ? 0.5 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: Colors.border,
        },
        variant === 'primary' && Shadows.glow(Colors.primaryGlow),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.btnInner}>
          {icon ? <Text style={{ fontSize, marginRight: 6 }}>{icon}</Text> : null}
          <Text style={{ color: textColor, fontSize, fontWeight: '600' }}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({
  label,
  color = Colors.primary,
  emoji,
}: {
  label: string;
  color?: string;
  emoji?: string;
}) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + '22', borderColor: color + '44' },
      ]}
    >
      {emoji ? (
        <Text style={styles.badgeEmoji}>{emoji}</Text>
      ) : null}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export function ProgressBar({
  progress,
  color = Colors.primary,
  height = 6,
  style,
}: {
  progress: number;
  color?: string;
  height?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(100, Math.max(0, progress))}%`,
            height,
            borderRadius: height / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({
  emoji,
  title,
  subtitle,
  action,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {action && (
        <Button
          label={action.label}
          onPress={action.onPress}
          style={{ marginTop: Spacing.lg }}
        />
      )}
    </View>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  btn: {
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  badgeEmoji: {
    fontSize: 10,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  progressTrack: {
    width: '100%',
    backgroundColor: Colors.bg4,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.giant,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});
