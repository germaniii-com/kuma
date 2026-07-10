import Stepper from '../../components/Stepper';
import ThemeSelectorButton from '../../components/ThemeSelector/ThemeSelectorButton';
import { useThemeContext } from '../../shared/providers/ThemeProvider';
import './index.css';
import { useContext } from 'react';
import ScreenContext from '../../shared/providers/ScreenContext';

const Header = () => {
  const { currentStep, completedSteps, goToStep } =
    useContext(ScreenContext);

  const { selectValue, onSelectChange } = useThemeContext();

  return (
    <div className="header">
      <span className="header_title">Kuma</span>

      <Stepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepSelect={goToStep}
      />

      <div className="header_theme_controls">
        <ThemeSelectorButton
          theme={selectValue}
          onSelect={onSelectChange}
          size="sm"
        />
      </div>
    </div>
  );
};

export default Header;
