// Theme utility - switches between color palettes based on env var

export type ColorTheme = 'default' | 'v2';

export function getActiveTheme(): ColorTheme {
  const theme = process.env.NEXT_PUBLIC_COLOR_THEME as ColorTheme;
  return theme === 'v2' ? 'v2' : 'default';
}

export function getThemeClassName(): string {
  const theme = getActiveTheme();
  return theme === 'v2' ? 'theme-v2' : '';
}
