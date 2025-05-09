import React from 'react';
import './Score.css';

const failSound = new Audio('/sounds/fail.mp3');
const victorySound = new Audio('/sounds/victory.wav');

function Score({ score, total }) {
  const percentage = Math.round((score / total) * 100);
  let feedback;
  let grade;

  if (percentage <= 60) {
    grade = 'fail';
    feedback = 'Keep practicing!';
    failSound.play();
  } else if (percentage >= 61 && percentage <= 79) {
    grade = 'passing';
    feedback = 'Great! Keep practicing!';
    victorySound.play();
  } else {
    grade = 'amazing';
    feedback = 'AMAZING!!'
    victorySound.play();
  }

  return (
    <div className="score-card">
      <h3>Quiz Complete!</h3>
      <h1>You Scored:</h1>
      <h1 className={grade}>{percentage}%</h1>
      <h2>{feedback}</h2>  
      <p>{score} out of {total} correct</p>
      <button className="replay" onClick={() => window.location.reload()}>Play Again</button>
    </div>
  );
}

export default Score;