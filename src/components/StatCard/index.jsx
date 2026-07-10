import './index.css';

const StatCard = ({ value, label, tone = 'default' }) => (
  <div className="stat_card">
    <span className={`stat_card_value${tone !== 'default' ? ` stat_card_value--${tone}` : ''}`}>
      {value}
    </span>
    <span className="stat_card_label">{label}</span>
  </div>
);

export default StatCard;
