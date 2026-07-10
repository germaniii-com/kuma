import {
  DETECT_LAYOUT_SCREEN,
  KEYBOARD_CONFIG_SCREEN,
  STEP_DETECT,
  STEP_CONFIG,
  STEP_TEST,
  TYPER_SCREEN,
  TYPER_SUMMARY_SCREEN,
  screenToStep,
} from '../constants/screen';
import { MOVIE_QUOTES } from '../constants/quotes';
import { IGNORED_KEYS } from '../constants/keys';
import {
  getKeyIndexFromCode,
  getTargetCharFromPhysicalKey,
} from '../utils/translatePhysicalKey';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const getRandomQuote = () =>
  MOVIE_QUOTES[Math.floor(Math.random() * 10) % MOVIE_QUOTES.length];

const useKeyboard = ({
  isMappingKey = false,
  getTargetKeymap,
  getSourceKeymap,
  sourceLayout,
  targetLayout,
}) => {
  const [screen, setScreen] = useState(DETECT_LAYOUT_SCREEN);
  const [typerReturnScreen, setTyperReturnScreen] = useState(
    KEYBOARD_CONFIG_SCREEN
  );
  const [key, setKey] = useState('');
  const [quote, setQuote] = useState(getRandomQuote());
  const [timestamps, setTimestamps] = useState([]);
  const [pressedKeyIndex, setPressedKeyIndex] = useState(null);
  const highlightTimeoutRef = useRef(null);

  const clearHighlight = useCallback(() => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
    setPressedKeyIndex(null);
  }, []);

  const setHighlightIndex = useCallback(
    (index) => {
      if (index === null) {
        clearHighlight();
        return;
      }
      setPressedKeyIndex(index);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      highlightTimeoutRef.current = setTimeout(() => {
        setPressedKeyIndex(null);
        highlightTimeoutRef.current = null;
      }, 200);
    },
    [clearHighlight]
  );

  const currentStep = useMemo(() => screenToStep(screen), [screen]);

  const completedSteps = useMemo(() => {
    const steps = [];
    if (sourceLayout) steps.push(STEP_DETECT);
    if (targetLayout) steps.push(STEP_CONFIG);
    if (screen === TYPER_SUMMARY_SCREEN) steps.push(STEP_TEST);
    return steps;
  }, [sourceLayout, targetLayout, screen]);

  const resetTyperState = useCallback(() => {
    setKey('');
    setTimestamps([]);
    setQuote(getRandomQuote());
    clearHighlight();
  }, [clearHighlight]);

  const goToTyper = useCallback(
    (returnScreen) => {
      resetTyperState();
      if (returnScreen !== undefined) {
        setTyperReturnScreen(returnScreen);
      }
      setScreen(TYPER_SCREEN);
    },
    [resetTyperState]
  );

  const goBackFromTyper = useCallback(() => {
    clearHighlight();
    setScreen(typerReturnScreen);
  }, [typerReturnScreen, clearHighlight]);

  const goToStep = useCallback(
    (step) => {
      if (step === currentStep) return;
      if (step === STEP_DETECT) {
        resetTyperState();
        setScreen(DETECT_LAYOUT_SCREEN);
        return;
      }
      if (step === STEP_CONFIG) {
        resetTyperState();
        setScreen(KEYBOARD_CONFIG_SCREEN);
        return;
      }
      if (step === STEP_TEST) {
        goToTyper(KEYBOARD_CONFIG_SCREEN);
      }
    },
    [currentStep, resetTyperState, goToTyper]
  );

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const eventListener = (kpe) => {
      if (isMappingKey) return;
      if (IGNORED_KEYS.some((ignored) => ignored === kpe.key)) return;

      const isTyper = screen === TYPER_SCREEN;
      const isConfig = screen === KEYBOARD_CONFIG_SCREEN;
      const isSummary = screen === TYPER_SUMMARY_SCREEN;

      if (isTyper || isSummary) {
        kpe.preventDefault();
      }

      const targetKeymap = getTargetKeymap?.();
      const sourceKeymap = getSourceKeymap?.() ?? null;

      switch (screen) {
        case KEYBOARD_CONFIG_SCREEN: {
          const physicalIndex = getKeyIndexFromCode(kpe.code);
          if (physicalIndex !== null) {
            setHighlightIndex(physicalIndex);
          }
          break;
        }
        case TYPER_SCREEN:
          if (kpe.key === 'Enter') break;

          if (!targetKeymap) break;

          const translated = getTargetCharFromPhysicalKey(
            kpe.code,
            kpe.key,
            targetKeymap,
            sourceKeymap
          );

          if (!translated) break;

          if (translated.index != null) {
            setHighlightIndex(translated.index);
          }

          if (translated.type === 'backspace') {
            setKey((prev) => prev.slice(0, -1));
            setTimestamps((prev) => [
              ...prev,
              { timestamp: Date.now(), key: 'Backspace' },
            ]);
            break;
          }

          setTimestamps((prev) => [
            ...prev,
            {
              timestamp: Date.now(),
              key: translated.value,
              code: kpe.code,
            },
          ]);
          setKey((prev) => prev + translated.value);
          break;
        case TYPER_SUMMARY_SCREEN:
          if (kpe.key === 'Enter') {
            resetTyperState();
            setScreen(TYPER_SCREEN);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', eventListener);

    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, [
    screen,
    isMappingKey,
    resetTyperState,
    getTargetKeymap,
    getSourceKeymap,
    setHighlightIndex,
  ]);

  useEffect(() => {
    if (screen === TYPER_SCREEN && key.length >= quote.quote?.length) {
      setScreen(TYPER_SUMMARY_SCREEN);
    }
  }, [screen, quote.quote, key]);

  return {
    screen,
    setScreen,
    currentStep,
    completedSteps,
    goToStep,
    key,
    quote,
    timestamps,
    pressedKeyIndex,
    typerReturnScreen,
    goToTyper,
    goBackFromTyper,
    resetTyperState,
  };
};

export default useKeyboard;
