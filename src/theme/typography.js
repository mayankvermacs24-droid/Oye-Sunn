/**
 * Typography system for "oyee sun!" app
 * Bold, modern sans-serif fonts matching the reference style
 */

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const fontFamilyBold = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

export const Typography = {
  // App title / brand
  brand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  
  // Large headings
  h1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  
  // Section headings
  h2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  
  // Sub-headings
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Card titles
  h4: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Body text
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  
  // Body bold
  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Small text
  small: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  
  // Caption text
  caption: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  
  // Chip text
  chip: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  
  // Button text small
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Input text
  input: {
    fontSize: 15,
    fontWeight: '400',
  },
  
  // Input label
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 50,
  full: 999,
};

export const Shadows = {
  soft: {
    shadowColor: '#1E2B1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#1E2B1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  strong: {
    shadowColor: '#1E2B1E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default { Typography, Spacing, BorderRadius, Shadows };
