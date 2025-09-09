import React, { useState } from 'react';

function Cell({
  text,
  secondHint,
  solution,
  color,
  textContrast,
  clickCount,
  defaultBg,
  getTextColor,
  onHintClick,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hintClicked, setHintClicked] = useState(false);
  const [guess, setGuess] = useState(''); // current text in the guess input
  const [log, setLog] = useState([]); // optional visual log (debug)

  const renderPlaceholder = (revealFirstLetter = false) => {
    if (!solution) return null;
    const length = solution.length;
    if (length === 0) return null;
    return revealFirstLetter
      ? solution[0] + '-'.repeat(length - 1)
      : '-'.repeat(length);
  };

  const renderContent = () => {
    switch (clickCount) {
      case 0:
        return <div>{text}</div>;
      case 1:
      case 2:
        return (
          <>
            <div>{text}</div>
            <div>{secondHint}</div>
          </>
        );
      case 3:
        return (
          <>
            <div>{text}</div>
            <div>{secondHint}</div>
            <div>{renderPlaceholder()}</div>
          </>
        );
      case 4:
        return (
          <>
            <div>{text}</div>
            <div>{secondHint}</div>
            <div>{renderPlaceholder(true)}</div>
          </>
        );
      case 5:
        return <div>{solution}</div>;
      default:
        return <div>{text}</div>;
    }
  };

  const backgroundColor = clickCount >= 2 ? color : defaultBg;
  const textColor = clickCount >= 2 ? getTextColor(textContrast) : 'inherit';

  const isFullyRevealed = clickCount === 5;

  // Handler for cell click (reshow hint UI unless fully solved)
  const handleCellClick = (e) => {
    // Prevent toggling hint UI when clicking the hint button itself (handled separately)
    if (isFullyRevealed) return;

    // If hint UI is hidden (hintClicked === true), show it again on cell click
    if (hintClicked) {
      setHintClicked(false);
      setIsHovered(true);
    }
  };

  // Handler for hint button click (hide hint UI)
  const handleHintButtonClick = (e) => {
    e.stopPropagation(); // prevent bubbling to cell click
    setHintClicked(true);
    onHintClick();
  };

  // Called when the user presses Enter in the guess box
  function submitGuess(value) {
    const trimmed = value.trim();

    // Log to console – replace with an API call if you need persistence
    console.log('User guess:', trimmed);
    console.log('Correct solution:', solution);

    // Optional: keep a visible log inside the component (useful while testing)
    setLog((prev) => [...prev, `guess="${trimmed}" | solution="${solution}"`]);
  }

  // Update state as the user types
  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  // Detect Enter key → submit the guess
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // stop any default form behaviour
      submitGuess(guess);
      setGuess(''); // clear the field after submitting (optional)
    }
  };

  return (
    <div
      className='cell'
      style={{
        backgroundColor,
        color: textColor,
        position: 'relative',
        cursor: isFullyRevealed ? 'default' : 'pointer',
      }}
      onMouseEnter={() => {
        if (!hintClicked && !isFullyRevealed) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setHintClicked(false);
      }}
      onClick={handleCellClick}
    >
      {/* Dark overlay */}
      {isHovered && !hintClicked && !isFullyRevealed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
      )}

      <div className='cell-content' style={{ position: 'relative', zIndex: 0 }}>
        {renderContent()}
      </div>

      {/* Hint UI: hint button first, then guess input */}
      {isHovered && !hintClicked && !isFullyRevealed && (
        <div className='hover-overlay' style={{ zIndex: 2 }}>
          <button className='hover-button' onClick={handleHintButtonClick}>
            hint
          </button>
          <input
            type='text'
            placeholder='guess!'
            className='hover-input'
            value={guess} // controlled component
            onChange={handleInputChange} // update `guess` state
            onKeyDown={handleKeyDown} // submit on Enter
          />
        </div>
      )}
    </div>
  );
}

export default Cell;
