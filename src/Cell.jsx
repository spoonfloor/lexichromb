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
    // Clean the incoming value the same way the input does
    const trimmed = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z ]+/g, '');

    // Compare with the solution (also lower‑cased for a case‑insensitive match)
    const isMatch = trimmed === solution.toLowerCase();

    // Log both strings
    console.log('User guess:', trimmed);
    console.log('Correct solution:', solution);

    // Indicate match / mismatch
    if (isMatch) {
      console.log('✅ Guess matches the solution!');
    } else {
      console.log('❌ Guess does NOT match the solution.');
    }

    // Optional visual log (debug) – shows the result as well
    setLog((prev) => [
      ...prev,
      `guess="${trimmed}" | solution="${solution}" | ${
        isMatch ? 'MATCH' : 'NO MATCH'
      }`,
    ]);
  }

  // Update state as the user types – forces lowercase & allows only a‑z and spaces
  const handleInputChange = (e) => {
    // Grab raw input
    const raw = e.target.value;

    // Keep only letters a‑z and spaces, then convert to lower‑case
    const cleaned = raw.toLowerCase().replace(/[^a-z ]+/g, ''); // remove everything else

    setGuess(cleaned);
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
            <span className='material-symbols-outlined hint-icon'>
              lightbulb_2
            </span>
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
