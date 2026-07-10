import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_THEME,
  THEME_COLORS,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  getThemeColors,
} from '../constants/themes';

const hexToRgb = (hex) => {
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  if (h.length >= 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  return null;
};

const withAlpha = (color, alpha) => {
  if (!color) return `rgba(0, 0, 0, ${alpha})`;
  const rgb = hexToRgb(color);
  if (rgb) return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  return color;
};

const colorsToCssVars = (colors) => ({
  '--color-bg': colors.background,
  '--color-fg': colors.text,
  '--color-surface': colors.surface,
  '--color-surface-elevated': colors.surfaceSecondary,
  '--color-border': colors.border,
  '--color-border-muted': colors.surfaceSecondary,
  '--color-muted': colors.textMuted,
  '--color-accent': colors.primary,
  '--color-accent-muted': withAlpha(colors.primary, 0.25),
  '--color-success': colors.success,
  '--color-error': colors.danger,
  '--color-warning': colors.accent,
  '--color-overlay': withAlpha(colors.background, 0.75),
  '--color-input-bg': colors.surfaceSecondary,
  '--color-primary': colors.primary,
  '--color-secondary': colors.secondary,
});

const applyTheme = (themeId) => {
  const colors = getThemeColors(themeId);
  const themeOption = THEME_OPTIONS.find((t) => t.value === themeId);
  const colorScheme = themeOption?.mode === 'light' ? 'light' : 'dark';
  const cssVars = colorsToCssVars(colors);
  const root = document.documentElement;
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.style.setProperty('color-scheme', colorScheme);
};

const loadTheme = () => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && THEME_COLORS[raw]) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
};

const saveTheme = (themeId) => {
  localStorage.setItem(THEME_STORAGE_KEY, themeId);
};

const useTheme = () => {
  const [themeId, setThemeId] = useState(() => loadTheme());

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  useEffect(() => {
    saveTheme(themeId);
  }, [themeId]);

  const setTheme = useCallback((id) => {
    if (THEME_COLORS[id]) {
      setThemeId(id);
    }
  }, []);

  // Preserve shape for ThemeProvider consumers
  const presets = useMemo(
    () =>
      THEME_OPTIONS.map((opt) => ({
        id: opt.value,
        label: opt.label,
        type: opt.mode,
      })),
    []
  );

  return {
    themeId,
    setTheme,
    presets,
    selectValue: themeId,
    onSelectChange: setTheme,
    // Stubs for compatibility — no custom import anymore
    customTheme: null,
    themeError: null,
    removeCustomTheme: () => {},
    openThemeFilePicker: () => {},
    onThemeFileChange: () => {},
  };
};

export default useTheme;
