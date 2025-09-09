import React, { useState } from 'react';
import Cell from './Cell';
import './App.css';
import puzzleData from './data/puzzleData.json';

const DEFAULT_BG = '#f0f0f0'; // Default background color

function App() {
  const level = puzzleData.levels[0];
  const hints1 = level.hints[0];
  const hints2 = level.hints[1];
  const solutions = level.solutions.text;
  const colors = level.solutions.color;
  const textContrast = level.solutions.textContrast;

  const [clickCounts, setClickCounts] = useState(
    Array(solutions.length).fill(0)
  );

  const handleCellClick = (index) => {
    setClickCounts((prev) =>
      prev.map((count, i) => (i === index ? Math.min(count + 1, 5) : count))
    );
  };

  // New handler for hint button clicks
  const handleHintClick = (index) => {
    setClickCounts((prev) =>
      prev.map((count, i) => (i === index ? Math.min(count + 1, 5) : count))
    );
  };

  // App.jsx – inside the component body
  const handleCorrectGuess = (index) => {
    setClickCounts(
      (prev) => prev.map((cnt, i) => (i === index ? 5 : cnt)) // 5 → final solution
    );
  };

  const getTextColor = (contrast) => (contrast === 'light' ? '#fff' : '#000');

  // Split hints into columns: 2, 3, 2 cells
  const columns = [hints1.slice(0, 2), hints1.slice(2, 5), hints1.slice(5, 7)];

  return (
    <div className='app'>
      {columns.map((columnHints, colIndex) => (
        <div key={colIndex} className='column'>
          {columnHints.map((hint, index) => {
            const globalIndex =
              colIndex === 0 ? index : colIndex === 1 ? index + 2 : index + 5;

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
                onHintClick={() => handleHintClick(globalIndex)} // Pass new prop
                defaultBg={DEFAULT_BG}
                getTextColor={getTextColor}
                onCorrectGuess={() => handleCorrectGuess(globalIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default App;
