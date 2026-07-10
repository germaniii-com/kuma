import { useId } from 'react';
import './index.css';

const TabBar = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const baseId = useId();

  return (
    <div className={`tab_bar ${className}`} role="tablist">
      {tabs.map((tab) => {
        const tabId = `${baseId}-tab-${tab.id}`;
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            id={tabId}
            type="button"
            role="tab"
            className={`tab_bar_tab${isActive ? ' tab_bar_tab--active' : ''}`}
            aria-selected={isActive}
            aria-controls={`${baseId}-panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="tab_bar_icon" aria-hidden>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;
