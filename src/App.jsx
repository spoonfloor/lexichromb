import React, { useState, useEffect, useRef } from 'react';
import Cell from './Cell';
import './App.css';
import puzzleData from './data/puzzleData.json';
import useScaleToFit from './hooks/useScaleToFit';

const DEFAULT_BG = '#f0f0f0';

function App() {
  const wrapperRef = useRef(null); // the blue container
  useScaleToFit(wrapperRef);

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [hints1, setHints1] = useState([]);
  const [hints2, setHints2] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [colors, setColors] = useState({});
  const [textContrast, setTextContrast] = useState({});
  const initialCounts = Array(puzzleData.levels[0].solutions.text.length).fill(
    0
  );
  const [clickCounts, setClickCounts] = useState(initialCounts);
  const loadLevel = (idx) => {
    const level = puzzleData.levels[idx];
    setHints1(level.hints[0]);
    setHints2(level.hints[1]);
    setSolutions(level.solutions.text);
    setColors(level.solutions.color);
    setTextContrast(level.solutions.textContrast);

    // Reset click counts for the new level (same length as its solutions)
    setClickCounts(Array(level.solutions.text.length).fill(0));
  };

  useEffect(() => {
    loadLevel(currentLevelIdx);
  }, []); // run only once

  const handleCellClick = (index) => {
    setClickCounts((prev) =>
      prev.map((c, i) => (i === index ? Math.min(c + 1, 5) : c))
    );
  };

  const handleHintClick = (index) => {
    setClickCounts((prev) =>
      prev.map((c, i) => (i === index ? Math.min(c + 1, 5) : c))
    );
  };

  const handleCorrectGuess = (index) => {
    setClickCounts((prev) => prev.map((c, i) => (i === index ? 5 : c)));
  };

  const getTextColor = (contrast) => (contrast === 'light' ? '#fff' : '#000');

  const columns = [hints1.slice(0, 2), hints1.slice(2, 5), hints1.slice(5, 7)];

  const isLevelComplete =
    clickCounts.length > 0 && clickCounts.every((c) => c === 5);

  useEffect(() => {
    if (!isLevelComplete) return; // not finished yet

    // Alert blocks until the user clicks OK – perfect for “dismiss”
    alert('You amaze. Next level?');

    // Compute the next level index (wrap to 0 after the last level)
    const nextIdx = (currentLevelIdx + 1) % puzzleData.levels.length;

    // Update state and load the new level
    setCurrentLevelIdx(nextIdx);
    loadLevel(nextIdx);
  }, [isLevelComplete, currentLevelIdx]);

  return (
    <div className='app-root'>
      <div className='wrapper' ref={wrapperRef}>
        <div className='row'>
          {columns.map((columnHints, colIndex) => (
            <div key={colIndex} className='column'>
              {columnHints.map((hint, idx) => {
                // Global index matches the original logic you used
                const globalIndex =
                  colIndex === 0 ? idx : colIndex === 1 ? idx + 2 : idx + 5;

                const secondHint = hints2[globalIndex];
                const solution = solutions[globalIndex];
                const bgColor = colors[solution];
                const contrast = textContrast[solution];
                const clickCount = clickCounts[globalIndex];

                return (
                  <Cell
                    key={globalIndex}
                    text={hint}
                    secondHint={secondHint}
                    solution={solution}
                    color={bgColor}
                    textContrast={contrast}
                    clickCount={clickCount}
                    onClick={() => handleCellClick(globalIndex)}
                    onHintClick={() => handleHintClick(globalIndex)}
                    onCorrectGuess={() => handleCorrectGuess(globalIndex)}
                    defaultBg={DEFAULT_BG}
                    getTextColor={getTextColor}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
