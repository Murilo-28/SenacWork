/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',

    // Cores do Achados e Perdidos SENAC
    fundo: '#F4F7FB',
    superficie: '#FFFFFF',
    texto: '#0F1B2D',
    secundario: '#6B7A90',
    borda: '#E3E9F1',
    primario: '#00549A',
    primarioSuave: '#E6F0FA',
    acento: '#F7941D',
    destaque: '#F7941D', // faixa laranja do Senac (modo claro)
    acao: '#F7941D', // botão de ação principal (+)
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',

    // Cores do Achados e Perdidos SENAC
    fundo: '#0B1220',
    superficie: '#111A2B',
    texto: '#F1F5F9',
    secundario: '#94A3B8',
    borda: '#1F2A3D',
    primario: '#4A9BE8',
    primarioSuave: '#16263D',
    acento: '#F7941D',
    destaque: '#1F2A3D', // no escuro a faixa fica neutra
    acao: '#4A9BE8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Formato das cores usado pelas telas (claro e escuro têm as mesmas chaves)
export type Paleta = { [K in keyof typeof Colors.light]: string };

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;