import React from 'react';

function Score({ score, total }) {
  return (
    <div className="score-card">
      <h2>Quiz Complete!</h2>
      <p>Your Score: {score} out of {total}</p>
      <button onClick={() => window.location.reload()}>Play Again</button>
    </div>
  );
}

export default Score;
