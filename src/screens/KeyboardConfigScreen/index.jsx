import { useContext } from 'react';
import { FaEdit, FaFileExport } from 'react-icons/fa';
import './index.css';
import KeyboardKeys from '../../components/KeyboardKeys';
import ExportSidePanel from '../../components/Configure/ExportSidePanel';
import ConfirmDiscardCustomModal from '../../components/ConfirmDiscardCustomModal';
import {
  CUSTOM_LAYOUT_ID,
  KEYBOARD_LAYOUT_OPTIONS,
} from '../../shared/constants/keyboardLayouts';
import { KEYBOARD_CONFIG_SCREEN } from '../../shared/constants/screen';
import ScreenContext from '../../shared/providers/ScreenContext';
import { useKeyboardMapContext } from '../../shared/providers/KeyboardMapProvider';

const layoutLabel = (id) =>
  KEYBOARD_LAYOUT_OPTIONS.find((o) => o.id === id)?.label ?? id;

const KeyboardConfigScreen = () => {
  const { goToTyper } = useContext(ScreenContext);
  const {
    sourceLayout,
    targetLayout,
    requestTargetLayout,
    hasCustomKeymapChanges,
    isEditingKeymap,
    startEditMode,
    stopEditMode,
    cancelCustomKeymapChanges,
    isDiscardConfirmOpen,
    confirmDiscardCustomChanges,
    cancelDiscardCustomChanges,
    openExportModal,
  } = useKeyboardMapContext();

  const onClickEditKeyboard = () => {
    if (isEditingKeymap) {
      stopEditMode();
    } else {
      startEditMode();
    }
  };

  const sourceLabel = sourceLayout ? layoutLabel(sourceLayout) : 'Not set';

  return (
    <div className="keyboard_config_screen">
      <div className="keyboard_config_screen_header">
        <h2>Keyboard layout</h2>
        <button
          type="button"
          className="keyboard_config_screen_export"
          title="Export layout"
          onClick={openExportModal}
        >
          <FaFileExport aria-hidden />
          Export layout
        </button>
      </div>

      <div className="keyboard_config_screen_layouts">
        <div className="keyboard_config_screen_column">
          <span className="keyboard_config_screen_label">
            Your current layout:
          </span>
          <strong className="keyboard_config_screen_value">{sourceLabel}</strong>
        </div>
        <div className="keyboard_config_screen_column">
          <label className="keyboard_config_screen_field">
            <span className="keyboard_config_screen_label">
              Select a layout:
            </span>
            <div className="keyboard_config_screen_target_row">
              <select
                className="keyboard_config_screen_value"
                value={targetLayout}
                onChange={(e) => requestTargetLayout(e.target.value)}
              >
                {KEYBOARD_LAYOUT_OPTIONS.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              {targetLayout === CUSTOM_LAYOUT_ID && hasCustomKeymapChanges && (
                <div className="keyboard_config_screen_actions">
                  <button
                    type="button"
                    className="wizard_secondary_button keyboard_config_screen_action"
                    onClick={cancelCustomKeymapChanges}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="wizard_button keyboard_config_screen_action"
                    onClick={stopEditMode}
                  >
                    Save
                  </button>
                </div>
              )}
              {targetLayout === CUSTOM_LAYOUT_ID && !hasCustomKeymapChanges && (
                <FaEdit
                  className={
                    isEditingKeymap
                      ? 'keyboard_config_screen_edit--active'
                      : ''
                  }
                  title="Edit keys"
                  onClick={onClickEditKeyboard}
                />
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="keyboard_config_screen_body">
        <div className="keyboard_config_screen_main">
          <p className="keyboard_config_screen_hint">
            Type on your keyboard to see which target keys light up.
          </p>
          <KeyboardKeys />
          <button
            type="button"
            className="wizard_button"
            onClick={() => goToTyper(KEYBOARD_CONFIG_SCREEN)}
          >
            Try it out
          </button>
        </div>

        {!isEditingKeymap && (
          <aside className="keyboard_config_screen_side">
            <ExportSidePanel />
          </aside>
        )}
      </div>

      <ConfirmDiscardCustomModal
        isOpen={isDiscardConfirmOpen}
        onConfirm={confirmDiscardCustomChanges}
        onCancel={cancelDiscardCustomChanges}
      />
    </div>
  );
};

export default KeyboardConfigScreen;
