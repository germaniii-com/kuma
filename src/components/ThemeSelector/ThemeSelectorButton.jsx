import { useState } from 'react';
import { THEME_OPTIONS, getThemeColors } from '../../shared/constants/themes';
import ThemeSelectorModal from './ThemeSelectorModal';
import './index.css';

const ThemeSelectorButton = ({ theme, onSelect, size = 'sm' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = getThemeColors(theme);
  const label =
    THEME_OPTIONS.find((opt) => opt.value === theme)?.label ?? theme;

  const sizeClass = size === 'sm' ? '0.35em 0.6em' : '0.5em 0.8em';

  return (
    <>
      <button
        type="button"
        className="theme_selector_button"
        style={{ padding: sizeClass }}
        onClick={() => setIsOpen(true)}
        aria-label="Select theme"
      >
        <span
          className="theme_selector_dot"
          style={{ backgroundColor: colors.text }}
        />
        <span className="theme_selector_label">{label}</span>
      </button>
      <ThemeSelectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentTheme={theme}
        onSelect={onSelect}
      />
    </>
  );
};

export default ThemeSelectorButton;
