import { useState } from 'react';
import './index.css';
import TabBar from '../Modal/TabBar';
import {
  EXPORT_FORMATS,
  getActiveKeymap,
  formatKeymapExport,
} from '../../shared/utils/exportKeymap';
import { useKeyboardMapContext } from '../../shared/providers/KeyboardMapProvider';

const FORMAT_TABS = EXPORT_FORMATS.map((f) => ({
  id: f.id,
  label: f.label,
}));

const FORMAT_DESCRIPTIONS = {
  csv: 'CSV matrix with row, column, and keycode for each of the 30 alpha keys.',
  qmk: 'QMK keymap.json — a JSON layout object for the LAYOUT_kuma_alpha macro.',
  zmk: 'ZMK keymap snippet — YAML with a devicetree fragment for the alpha layer.',
};

const ExportKeymapModal = () => {
  const {
    isExportModalOpen,
    closeExportModal,
    sourceLayout,
    targetLayout,
    customKeymap,
  } = useKeyboardMapContext();

  const [formatId, setFormatId] = useState('csv');
  const [filenamePrefix, setFilenamePrefix] = useState('kuma-keymap');
  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const keymap = getActiveKeymap(targetLayout, customKeymap);
  const metadata = {
    sourceLayout,
    targetLayout,
    exportedAt: new Date().toISOString(),
  };

  const handleDownload = () => {
    const content = formatKeymapExport(formatId, keymap, metadata);
    const format = EXPORT_FORMATS.find((f) => f.id === formatId);
    if (!format) return;

    const blob = new Blob([content], { type: format.mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${filenamePrefix.trim() || 'kuma-keymap'}.${format.extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    closeExportModal();
  };

  const handleCopy = async () => {
    const content = formatKeymapExport(formatId, keymap, metadata);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="export_keymap_modal_overlay" onClick={closeExportModal}>
      <div
        className="export_keymap_modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-keymap-title"
      >
        <h3 id="export-keymap-title">Export keyboard layout</h3>

        <TabBar
          tabs={FORMAT_TABS}
          activeTab={formatId}
          onTabChange={setFormatId}
        />

        <p className="export_keymap_modal_note">
          {FORMAT_DESCRIPTIONS[formatId] ||
            'Exports the 30-key alpha block shown in the app. You may need to adapt the file to your keyboard&apos;s matrix in QMK or ZMK.'}
        </p>

        <label className="export_keymap_modal_field">
          Filename prefix
          <input
            type="text"
            value={filenamePrefix}
            onChange={(e) => setFilenamePrefix(e.target.value)}
            placeholder="kuma-keymap"
          />
        </label>

        <div className="export_keymap_modal_actions">
          <button
            type="button"
            className="wizard_secondary_button"
            onClick={closeExportModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="wizard_secondary_button"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            className="wizard_button"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportKeymapModal;
