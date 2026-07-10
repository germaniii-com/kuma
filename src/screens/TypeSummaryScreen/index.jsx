import { useContext, useMemo } from 'react';
import './index.css';
import {
  DETECT_LAYOUT_SCREEN,
  KEYBOARD_CONFIG_SCREEN,
} from '../../shared/constants/screen';
import ScreenContext from '../../shared/providers/ScreenContext';
import { FaCog, FaSearch } from 'react-icons/fa';

const TyperSummaryScreen = () => {
  const { key, quote, timestamps, setScreen, goToTyper } =
    useContext(ScreenContext);

  const mistakes = useMemo(() => {
    if (!quote.quote || timestamps.length === 0) return 0;

    const typedKeys = key.split('');
    const expectedText = quote.quote.slice(0, typedKeys.length);

    const mistakeCount = typedKeys.reduce(
      (acc, curr, index) => (curr !== expectedText[index] ? acc + 1 : acc),
      0
    );

    const backspaces = timestamps.reduce(
      (acc, curr) => (curr.key === 'Backspace' ? acc + 1 : acc),
      0
    );

    return Math.floor(
      100 - ((mistakeCount + backspaces) / quote.quote.length) * 100
    );
  }, [key, quote.quote, timestamps]);

  const speed = useMemo(() => {
    if (timestamps.length < 2) return 0;
    const firstTimestamp = timestamps.at(0).timestamp;
    const lastTimestamp = timestamps.at(-1).timestamp;

    if (!firstTimestamp || !lastTimestamp) return 0;

    const totalChars = key.length;
    const totalWords = totalChars / 5;
    const elapsedTimeMinutes = (lastTimestamp - firstTimestamp) / 60000;

    return Math.floor(
      elapsedTimeMinutes > 0 ? totalWords / elapsedTimeMinutes : 0
    );
  }, [timestamps, key]);

  return (
    <div className="typer_summary_screen">
      <div className="typer_summary_screen_stats blinking">
        Speed: <span>{speed} (wpm)</span>
        <br />
        Accuracy: <span>{mistakes}%</span>
        <br />
        Press Enter to try another quote
      </div>
      <div className="typer_summary_screen_actions">
        <button type="button" className="wizard_button" onClick={goToTyper}>
          Try again
        </button>
      </div>
      <div className="typer_summary_screen_back_actions">
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

export default TyperSummaryScreen;
