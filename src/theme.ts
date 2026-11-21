import { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  // Backgrounds
  appBg: string;
  cardBg: string;
  headerBg: string;
  tabBarBg: string;
  searchBg: string;
  lyricsCardBg: string;
  // Text
  title: string;
  body: string;
  secondary: string;
  preview: string;
  headerTitle: string;
  headerSubtitle: string;
  // Accents
  accent: string;
  accentBar: string;
  authorBadgeBg: string;
  authorBadgeText: string;
  // Misc
  chevron: string;
  countLine: string;
  emptyIcon: string;
  emptyText: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarShadow: string;
  fontBtnBg: string;
  backBtnBg: string;
  divider: string;
  sectionLabel: string;
  dangerBtnBg: string;
  dangerBtnBorder: string;
  dangerBtnText: string;
};

export const lightColors: ThemeColors = {
  appBg: '#f4f1f8',
  cardBg: '#ffffff',
  headerBg: '#4a0e8f',
  tabBarBg: '#ffffff',
  searchBg: 'rgba(255,255,255,0.15)',
  lyricsCardBg: '#ffffff',
  title: '#1e1b2e',
  body: '#2a2438',
  secondary: '#4a4060',
  preview: '#9a9aa8',
  headerTitle: '#ffffff',
  headerSubtitle: '#c4a8ed',
  accent: '#4a0e8f',
  accentBar: '#7c3aed',
  authorBadgeBg: '#ede9fe',
  authorBadgeText: '#6d28d9',
  chevron: '#d1c7e0',
  countLine: '#e0d5ee',
  emptyIcon: '#d1c7e0',
  emptyText: '#b0a0c8',
  tabBarBorder: '#ede8f8',
  tabBarActive: '#4a0e8f',
  tabBarInactive: '#a090bc',
  tabBarShadow: '#4a0e8f',
  fontBtnBg: 'rgba(255,255,255,0.18)',
  backBtnBg: 'rgba(255,255,255,0.15)',
  divider: '#f0ebf8',
  sectionLabel: '#9880bc',
  dangerBtnBg: '#fff0f0',
  dangerBtnBorder: '#ffd5d5',
  dangerBtnText: '#c0392b',
};

export const darkColors: ThemeColors = {
  appBg: '#12101c',
  cardBg: '#1e1b2e',
  headerBg: '#2a1340',
  tabBarBg: '#1a1726',
  searchBg: 'rgba(255,255,255,0.1)',
  lyricsCardBg: '#1e1b2e',
  title: '#f0edf8',
  body: '#d0c8e0',
  secondary: '#a098b8',
  preview: '#7a7090',
  headerTitle: '#f0edf8',
  headerSubtitle: '#a78bfa',
  accent: '#a78bfa',
  accentBar: '#8b5cf6',
  authorBadgeBg: '#2d1b4e',
  authorBadgeText: '#c4b5fd',
  chevron: '#4a4060',
  countLine: '#2a2440',
  emptyIcon: '#3a3050',
  emptyText: '#6a6080',
  tabBarBorder: '#2a2440',
  tabBarActive: '#a78bfa',
  tabBarInactive: '#5a5070',
  tabBarShadow: '#000000',
  fontBtnBg: 'rgba(255,255,255,0.12)',
  backBtnBg: 'rgba(255,255,255,0.1)',
  divider: '#2a2440',
  sectionLabel: '#7a7090',
  dangerBtnBg: '#2a1010',
  dangerBtnBorder: '#4a2020',
  dangerBtnText: '#ff8080',
};

export const ThemeContext = createContext<{
  colors: ThemeColors;
  mode: ThemeMode;
  toggle: () => void;
}>({
  colors: lightColors,
  mode: 'light',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}
