import { Platform } from 'react-native';

const ios = Platform.OS === 'ios';

export const palette = {
  background: '#EEF2F7',
  backgroundStrong: '#E5EBF5',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F7FC',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#D7E0EC',
  primary: '#0A84FF',
  primarySoft: '#DBECFF',
  success: '#0E9F6E',
  danger: '#EF4444',
  shadow: '#0B1320',
};

export const type = {
  display: ios ? 'AvenirNext-Bold' : 'sans-serif-black',
  title: ios ? 'AvenirNext-DemiBold' : 'sans-serif-medium',
  body: ios ? 'AvenirNext-Regular' : 'sans-serif',
  emphasis: ios ? 'AvenirNext-Medium' : 'sans-serif-medium',
  mono: ios ? 'Menlo-Regular' : 'monospace',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
};

export const shadow = ios
  ? {
      shadowColor: palette.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    }
  : {
      elevation: 5,
    };

export const motion = {
  short: 220,
  medium: 360,
};

