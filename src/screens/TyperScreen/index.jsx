import { useContext, useState } from 'react';
import './index.css';
import PhraseDisplay from '../../components/PhraseDisplay';
import KeyboardKeys from '../../components/KeyboardKeys';
import {
  DETECT_LAYOUT_SCREEN,
  KEYBOARD_CONFIG_SCREEN,
} from '../../shared/constants/screen';
import ScreenContext from '../../shared/providers/ScreenContext';
import { FaCog, FaSearch, FaKeyboard } from 'react-icons/fa';

const TyperScreen = () => {
  const { key, quote, setScreen } = useContext(ScreenContext);
  const [showKeyboardKeys, setShowKeyboardKeys] = useState(true);

  return (
    <div className="typer_screen">
      <p className="typer_screen_hint">
        Keys are translated from your physical keyboard to the target layout.
      </p>
      <PhraseDisplay phrase={quote.quote} typed={key} />
      <p className="typer_screen_attribution">- {quote.from}</p>
      <button
        type="button"
        className={`typer_screen_keyboard_toggle${showKeyboardKeys ? ' typer_screen_keyboard_toggle--active' : ''}`}
        onClick={() => setShowKeyboardKeys((prev) => !prev)}
        aria-pressed={showKeyboardKeys}
      >
        <FaKeyboard aria-hidden />
        {showKeyboardKeys ? 'Hide keyboard' : 'Show keyboard'}
      </button>
      {showKeyboardKeys && <KeyboardKeys />}
      <div className="typer_screen_back_actions">
        <button
          type="button"
          className="wizard_secondary_button"
          onClick={() => setScreen(KEYBOARD_CONFIG_SCREEN)}
        >
          <FaCog aria-hidden /> Configure
        </button>
        <button
          type="button"
          className="wizard_secondary_button"
          onClick={() => setScreen(DETECT_LAYOUT_SCREEN)}
        >
          <FaSearch aria-hidden /> Detect Layout
        </button>
      </div>
    </div>
  );
};

export default TyperScreen;
