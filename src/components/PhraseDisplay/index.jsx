import './index.css';

const getKeyClassName = (expectedChar, typed, index) => {
  if (typed.length === index) return 'cursor';
  if (typed.length <= index) return 'pending';

  const isCorrect =
    expectedChar.toLowerCase() === typed[index]?.toLowerCase();

  if (!isCorrect && expectedChar === ' ') return 'wrong wrong-space';

  return isCorrect ? 'correct' : 'wrong';
};

const PhraseDisplay = ({ phrase, typed }) => (
  <p className="phrase_display">
    {phrase.split('').map((c, index) => (
      <span key={index} className={getKeyClassName(c, typed, index)}>
        {c}
      </span>
    ))}
  </p>
);

export default PhraseDisplay;
