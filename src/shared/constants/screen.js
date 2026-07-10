export const DETECT_LAYOUT_SCREEN = 0;
export const KEYBOARD_CONFIG_SCREEN = 1;
export const TYPER_SCREEN = 2;
export const TYPER_SUMMARY_SCREEN = 3;

export const STEP_DETECT = 1;
export const STEP_CONFIG = 2;
export const STEP_TEST = 3;

export const WIZARD_STEPS = [
  { id: STEP_DETECT, label: 'Detect', screen: DETECT_LAYOUT_SCREEN },
  { id: STEP_CONFIG, label: 'Configure', screen: KEYBOARD_CONFIG_SCREEN },
  { id: STEP_TEST, label: 'Test', screen: TYPER_SCREEN },
];

export const WIZARD_STEP_LABELS = {
  [DETECT_LAYOUT_SCREEN]: 'Detect',
  [KEYBOARD_CONFIG_SCREEN]: 'Configure',
  [TYPER_SCREEN]: 'Test',
  [TYPER_SUMMARY_SCREEN]: 'Test',
};

export const screenToStep = (screen) => {
  if (screen === TYPER_SCREEN || screen === TYPER_SUMMARY_SCREEN) {
    return STEP_TEST;
  }
  if (screen === KEYBOARD_CONFIG_SCREEN) return STEP_CONFIG;
  return STEP_DETECT;
};

export const stepToScreen = (step) =>
  WIZARD_STEPS.find((s) => s.id === step)?.screen ?? DETECT_LAYOUT_SCREEN;
