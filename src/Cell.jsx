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
  onCorrectGuess,
  onIncorrectGuess,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hintClicked, setHintClicked] = useState(false);
  const [guess, setGuess] = useState(''); // current text in the guess input

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

  function submitGuess(value) {
    const trimmed = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z ]+/g, '');

    // true → guess is correct
    return trimmed === solution.toLowerCase();
  }

  // Update state as the user types – forces lowercase & allows only a‑z and spaces
  const handleInputChange = (e) => {
    // Grab raw input
    const raw = e.target.value;

    // Keep only letters a‑z and spaces, then convert to lower‑case
    const cleaned = raw.toLowerCase().replace(/[^a-z ]+/g, ''); // remove everything else

    setGuess(cleaned);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const isRight = submitGuess(guess); // true → correct

      if (isRight) {
        onCorrectGuess?.(); // tells App to set count = 5
        alert('Nicely done!'); // ✅ success feedback
      } else {
        onIncorrectGuess?.(); // optional hook for App
        alert('Try again, plz…'); // ❌ failure feedback
      }

      setGuess(''); // clear the input field
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
            <span className='material-symbols-outlined hint-icon'>
              lightbulb_2
            </span>
          </button>
          <div className='guess-wrapper'>
            <input
              type='text'
              placeholder='guess!'
              className='hover-input'
              value={guess}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cell;
