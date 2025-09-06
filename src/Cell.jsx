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
            zIndex: 0,
            borderRadius: '8px',
          }}
        />
      )}

      <div className='cell-content' style={{ position: 'relative', zIndex: 1 }}>
        {renderContent()}
      </div>

      {/* Hint UI: hint button first, then guess input */}
      {isHovered && !hintClicked && !isFullyRevealed && (
        <div className='hover-overlay' style={{ zIndex: 2 }}>
          <button className='hover-button' onClick={handleHintButtonClick}>
            hint
          </button>
          <input type='text' placeholder='guess!' className='hover-input' />
        </div>
      )}
    </div>
  );
}

export default Cell;
