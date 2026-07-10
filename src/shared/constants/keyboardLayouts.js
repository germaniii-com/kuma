import {
  AZERTY,
  COLEMAK,
  DVORAK,
  QWERTY,
  QWERTZ,
  WORKMAN,
} from './keymaps';

export const CUSTOM_LAYOUT_ID = 'custom';
export const CUSTOM_KEYMAP_STORAGE_KEY = 'kuma-custom-keymap';
export const SCREEN_STORAGE_KEY = 'kuma-current-screen';

export const PRESET_KEYBOARD_LAYOUT_OPTIONS = [
  { id: 'qwerty', label: 'QWERTY' },
  { id: 'dvorak', label: 'Dvorak' },
  { id: 'colemak', label: 'Colemak' },
  { id: 'azerty', label: 'AZERTY' },
  { id: 'qwertz', label: 'QWERTZ' },
  { id: 'workman', label: 'Workman' },
];

export const KEYBOARD_LAYOUT_OPTIONS = [
  ...PRESET_KEYBOARD_LAYOUT_OPTIONS,
  { id: CUSTOM_LAYOUT_ID, label: 'Custom' },
];

export const WIZARD_STORAGE_KEY = 'kuma-wizard-state';

export const KEYBOARD_LAYOUT_TO_MAP = {
  qwerty: QWERTY,
  dvorak: DVORAK,
  colemak: COLEMAK,
  azerty: AZERTY,
  qwertz: QWERTZ,
  workman: WORKMAN,
};
