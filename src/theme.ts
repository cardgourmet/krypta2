import { createTheme, type DefaultMantineColor, type MantineColorsTuple, virtualColor } from '@mantine/core';

type ExtendedCustomColors = 'neutral' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}

export const theme = createTheme({
  black: '#212427',
  colors: {
    dark: [
      '#B6C2CF',
      '#9FADBC',
      '#8C9BAB',
      '#738496',
      '#596773',
      '#454F59',
      '#2C333A',
      '#22272B',
      'var(--gourmet-neutral-1)',
      'var(--gourmet-neutral-0)',
    ],
    gray: [
      '#F7F8F9',
      '#F1F2F4',
      '#DCDFE4',
      '#B3B9C4',
      '#8590A2',
      '#758195',
      '#626F86',
      '#44546F',
      '#2C3E5D',
      '#172B4D',
    ],
    neutralDark: [
      'var(--gourmet-neutral-0)',
      'var(--gourmet-neutral-1)',
      '#22272B',
      '#2C333A',
      '#454F59',
      '#596773',
      '#738496',
      '#8C9BAB',
      '#9FADBC',
      '#B6C2CF',
    ],
    neutralLight: [
      '#FFFFFF',
      '#F7F8F9',
      '#F1F2F4',
      '#DCDFE4',
      '#B3B9C4',
      '#8590A2',
      '#758195',
      '#626F86',
      '#44546F',
      '#2C3E5D',
    ],
    neutral: virtualColor({
      name: 'neutral',
      dark: 'neutralDark',
      light: 'neutralLight',
    }),
  },
  lineHeights: {
    xs: (18 / 12).toString(),
    sm: (20 / 14).toString(),
    md: (24 / 16).toString(),
    lg: (26 / 18).toString(),
    xl: (28 / 20).toString(),
  },
  spacing: {
    xs: '0.5rem',
  },
});
