export const Colors = {
  // Primary palette — deep space indigo
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  primaryGlow: 'rgba(124, 58, 237, 0.3)',

  // Accent — electric coral
  accent: '#F97316',
  accentLight: '#FED7AA',
  accentGlow: 'rgba(249, 115, 22, 0.3)',

  // Success — mint
  success: '#10B981',
  successLight: '#A7F3D0',
  successGlow: 'rgba(16, 185, 129, 0.3)',

  // Warning — amber
  warning: '#F59E0B',
  warningLight: '#FDE68A',

  // Danger — rose
  danger: '#EF4444',
  dangerLight: '#FECACA',

  // Background layers
  bg0: '#0A0A14',       // deepest
  bg1: '#0F0F1A',       // app background
  bg2: '#161625',       // cards
  bg3: '#1E1E30',       // elevated cards
  bg4: '#252538',       // inputs / surfaces

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderFocus: 'rgba(124, 58, 237, 0.6)',

  // Text
  text: '#F0EFFF',
  textSecondary: '#9B8FBF',
  textMuted: '#5A5275',
  textInverse: '#0F0F1A',

  // Special
  white: '#FFFFFF',
  transparent: 'transparent',

  // Note category colors
  categories: {
    project: { bg: '#7C3AED', light: '#EDE9FE', emoji: '🚀' },
    shopping: { bg: '#F97316', light: '#FFF7ED', emoji: '🛒' },
    appointment: { bg: '#10B981', light: '#ECFDF5', emoji: '📅' },
    process: { bg: '#3B82F6', light: '#EFF6FF', emoji: '⚙️' },
    personal: { bg: '#EC4899', light: '#FDF2F8', emoji: '💖' },
    ideas: { bg: '#F59E0B', light: '#FFFBEB', emoji: '💡' },
    travel: { bg: '#06B6D4', light: '#ECFEFF', emoji: '✈️' },
    health: { bg: '#EF4444', light: '#FEF2F2', emoji: '🏃' },
  },
};

export const Typography = {
  // Display
  displayXL: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1 },
  displayLG: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  displayMD: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },

  // Headings
  h1: { fontSize: 20, fontWeight: '700' as const },
  h2: { fontSize: 18, fontWeight: '600' as const },
  h3: { fontSize: 16, fontWeight: '600' as const },

  // Body
  bodyLG: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMD: { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  bodySM: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },

  // Labels
  labelLG: { fontSize: 14, fontWeight: '600' as const, letterSpacing: 0.2 },
  labelMD: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.3 },
  labelSM: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 0.5 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  giant: 48,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};
