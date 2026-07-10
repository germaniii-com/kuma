import Stepper from '../../components/Stepper';
import { useThemeContext } from '../../shared/providers/ThemeProvider';
import './index.css';
import { FaPalette, FaTrash } from 'react-icons/fa';
import { useContext } from 'react';
import ScreenContext from '../../shared/providers/ScreenContext';

const Header = () => {
  const { currentStep, completedSteps, goToStep } =
    useContext(ScreenContext);

  const {
    presets,
    customTheme,
    selectValue,
    onSelectChange,
    fileInputRef,
    onThemeFileChange,
    openThemeFilePicker,
    removeCustomTheme,
    themeError,
  } = useThemeContext();

  return (
    <div className="header">
      <span className="header_title">Kuma</span>

      <Stepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepSelect={goToStep}
      />

      <div className="header_theme_controls">
        <select
          className="header_theme_select"
          value={selectValue}
          onChange={onSelectChange}
          aria-label="Color theme"
        >
          {presets.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
          {customTheme && (
            <option value="__custom__">Custom: {customTheme.name}</option>
          )}
        </select>
        {customTheme && (
          <span className="header_theme_custom_label" title={customTheme.name}>
            {customTheme.name}
          </span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="invisible"
          aria-hidden
          onChange={onThemeFileChange}
        />
        <button
          type="button"
          className="header_theme_btn"
          title="Import VS Code theme"
          onClick={openThemeFilePicker}
        >
          <FaPalette aria-hidden />
        </button>
        {customTheme && (
          <button
            type="button"
            className="header_theme_btn"
            title="Remove custom theme"
            onClick={removeCustomTheme}
          >
            <FaTrash aria-hidden />
          </button>
        )}
        {themeError && (
          <p className="header_theme_error" role="alert">
            {themeError}
          </p>
        )}
      </div>
    </div>
  );
};

export default Header;
