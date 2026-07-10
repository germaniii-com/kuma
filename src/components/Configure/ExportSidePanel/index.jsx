import { useState } from 'react';
import './index.css';
import TabBar from '../../Modal/TabBar';
import {
  EXPORT_FORMATS,
  getActiveKeymap,
  formatKeymapExport,
} from '../../../shared/utils/exportKeymap';
import { useKeyboardMapContext } from '../../../shared/providers/KeyboardMapProvider';
import { FaCopy, FaDownload } from 'react-icons/fa';

const FORMAT_TABS = EXPORT_FORMATS.map((f) => ({
  id: f.id,
  label: f.label,
}));

const ExportSidePanel = () => {
  const {
    sourceLayout,
    targetLayout,
    customKeymap,
  } = useKeyboardMapContext();

  const [formatId, setFormatId] = useState('csv');
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const keymap = getActiveKeymap(targetLayout, customKeymap);
  const metadata = {
    sourceLayout,
    targetLayout,
    exportedAt: new Date().toISOString(),
  };

  const format = EXPORT_FORMATS.find((f) => f.id === formatId);

  const handleDownload = () => {
    if (!format) return;
    const content = formatKeymapExport(formatId, keymap, metadata);
    const blob = new Blob([content], { type: format.mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `kuma-keymap.${format.extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const content = formatKeymapExport(formatId, keymap, metadata);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
    <div className={`export_side_panel${collapsed ? ' export_side_panel--collapsed' : ''}`}>
      <button
        type="button"
        className="export_side_panel_toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand export panel' : 'Collapse export panel'}
      >
        {collapsed ? '⤓ Export' : '⤓ Quick export'}
      </button>

      {!collapsed && (
        <div className="export_side_panel_body">
          <TabBar
            tabs={FORMAT_TABS}
            activeTab={formatId}
            onTabChange={setFormatId}
          />

          <div className="export_side_panel_actions">
            <button
              type="button"
              className="wizard_secondary_button"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <FaCopy aria-hidden />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              type="button"
              className="wizard_button"
              onClick={handleDownload}
              title="Download file"
            >
              <FaDownload aria-hidden />
              Download
            </button>
          </div>

          <p className="export_side_panel_note">
            Exports the 30-key alpha block. Use the full export dialog for more options.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportSidePanel;
