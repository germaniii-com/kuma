import { useEffect, useRef, useState } from 'react';
import { BiCheck, BiX } from 'react-icons/bi';
import { THEME_OPTIONS, THEME_COLORS } from '../../shared/constants/themes';
import './index.css';

const ThemeSelectorModal = ({ isOpen, onClose, currentTheme, onSelect }) => {
  const [phase, setPhase] = useState('hidden');
  const exitTimer = useRef(null);

  useEffect(() => {
    if (isOpen && phase === 'hidden') {
      const t = setTimeout(() => setPhase('entering'), 0);
      return () => clearTimeout(t);
    }
    if (!isOpen && phase === 'visible') {
      const t = setTimeout(() => setPhase('exiting'), 0);
      return () => clearTimeout(t);
    }
  }, [isOpen, phase]);

  /* Complete entering after the enter animation duration */
  useEffect(() => {
    if (phase !== 'entering') return;
    const t = setTimeout(() => setPhase('visible'), 200);
    return () => clearTimeout(t);
  }, [phase]);

  /* Complete exiting after the exit animation duration */
  useEffect(() => {
    if (phase !== 'exiting') return;
    exitTimer.current = setTimeout(() => {
      setPhase('hidden');
      onClose();
    }, 150);
    return () => clearTimeout(exitTimer.current);
  }, [phase, onClose]);

  useEffect(() => {
    if (phase !== 'exiting' && phase !== 'visible') return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [phase, onClose]);

  useEffect(() => {
    if (phase === 'hidden') {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <>
      <div className="theme_modal_backdrop" onClick={onClose} />

      <div className="theme_modal_container">
        <div
          className={`theme_modal_dialog theme_modal_dialog--${phase}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a theme"
        >
          <div className="theme_modal_header">
            <h2 className="theme_modal_title">Choose a theme</h2>
            <button
              type="button"
              className="theme_modal_close"
              onClick={onClose}
              aria-label="Close theme selector"
            >
              <BiX />
            </button>
          </div>

          <div className="theme_modal_grid">
            {THEME_OPTIONS.map((opt) => {
              const colors = THEME_COLORS[opt.value];
              const isSelected = opt.value === currentTheme;
              const [first, ...rest] = opt.label.split(' ');
              const restLabel = rest.join(' ');

              return (
                <div
                  key={opt.value}
                  data-theme={opt.value}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(opt.value);
                      onClose();
                    }
                  }}
                  className={`theme_modal_card${isSelected ? ' theme_modal_card--selected' : ''}`}
                  style={{ backgroundColor: colors.surface }}
                >
                  <div className="theme_modal_swatches">
                    <span
                      className="theme_modal_swatch"
                      style={{ backgroundColor: colors.surfaceSecondary }}
                    />
                    <span
                      className="theme_modal_swatch"
                      style={{ backgroundColor: colors.border }}
                    />
                    <span
                      className="theme_modal_swatch"
                      style={{ backgroundColor: colors.success }}
                    />
                    <span
                      className="theme_modal_swatch"
                      style={{ backgroundColor: colors.danger }}
                    />
                  </div>

                  <p
                    className="theme_modal_card_name"
                    style={{ color: colors.text }}
                  >
                    {first}
                  </p>
                  {restLabel && (
                    <p
                      className="theme_modal_card_name theme_modal_card_name--second"
                      style={{ color: colors.text }}
                    >
                      {restLabel}
                    </p>
                  )}

                  <p
                    className="theme_modal_card_aa"
                    style={{ color: colors.textMuted }}
                  >
                    Aa
                  </p>

                  {isSelected && (
                    <div
                      className="theme_modal_check"
                      style={{ backgroundColor: colors.text }}
                    >
                      <BiCheck style={{ color: colors.surface }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSelectorModal;
