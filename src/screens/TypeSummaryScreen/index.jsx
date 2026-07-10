import { useContext, useMemo } from 'react';
import './index.css';
import StatCard from '../../components/StatCard';
import {
  DETECT_LAYOUT_SCREEN,
  KEYBOARD_CONFIG_SCREEN,
} from '../../shared/constants/screen';
import ScreenContext from '../../shared/providers/ScreenContext';
import { FaCog, FaSearch } from 'react-icons/fa';

const TyperSummaryScreen = () => {
  const { key, quote, timestamps, setScreen, goToTyper } =
    useContext(ScreenContext);

  const accuracy = useMemo(() => {
    if (!quote.quote || timestamps.length === 0) return 0;

    const typedKeys = key.split('');
    const expectedText = quote.quote.slice(0, typedKeys.length);

    const mistakeCount = typedKeys.reduce(
      (acc, curr, index) =>
        curr.toLowerCase() !== expectedText[index]?.toLowerCase() ? acc + 1 : acc,
      0
    );

    const denominator = Math.max(typedKeys.length, quote.quote.length);

    return Math.floor(
      100 - (mistakeCount / denominator) * 100
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

  const elapsedSeconds = useMemo(() => {
    if (timestamps.length < 2) return 0;
    const first = timestamps.at(0).timestamp;
    const last = timestamps.at(-1).timestamp;
    return Math.round((last - first) / 1000);
  }, [timestamps]);

  const accuracyTone =
    accuracy >= 95 ? 'success' : accuracy < 80 ? 'error' : 'default';

  return (
    <div className="typer_summary_screen">
      <div className="typer_summary_screen_stats">
        <StatCard value={speed} label="wpm" />
        <StatCard value={`${accuracy}%`} label="accuracy" tone={accuracyTone} />
        <StatCard value={elapsedSeconds} label="seconds" />
      </div>
      <p className="typer_summary_screen_hint blinking">
        Press Enter to try another quote
      </p>
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
