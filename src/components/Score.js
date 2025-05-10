import React, { useState, useEffect } from 'react';
import './Score.css';

const failSound = new Audio('/sounds/fail.mp3');
const victorySound = new Audio('/sounds/victory.wav');

function Score({ score, total, answerHistory }) {
  const [showRecap, setShowRecap] = useState(false);
  const percentage = Math.round((score / total) * 100);
  let feedback;
  let grade;

  if (percentage <= 60) {
    grade = 'fail';
    feedback = 'Keep practicing!';
  } else if (percentage >= 61 && percentage <= 79) {
    grade = 'passing';
    feedback = 'Great! Keep practicing!';
  } else {
    grade = 'amazing';
    feedback = 'AMAZING!!'
  }

  // Play score screen sound once
  useEffect((percentage) => {
    if (percentage <= 60) {
      failSound.play();
    } else {
      victorySound.play();
    }
  }, []);

  return (
    <div className="score-card">
      <h3>Quiz Complete!</h3>
      <h2>You Scored:</h2>
      <h1 className={grade}>{percentage}%</h1>
      <h2>{feedback}</h2>
      <p>{score} out of {total} correct</p>

      <div className="button-group">
        <button className="recap" onClick={() => setShowRecap(!showRecap)}>
          {showRecap ? 'Hide Recap' : 'Review Answers'}
        </button>
        <button className="replay" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>

      {showRecap && (
        <div className="responsive-recap">
          <table className="recap-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {answerHistory.map((item, index) => (
                <tr key={index}>
                  <td dangerouslySetInnerHTML={{ __html: item.question }} />
                  <td
                    className={
                      item.selected === item.correct ? 'correct' : 'incorrect'
                    }
                    dangerouslySetInnerHTML={{ __html: item.selected }}
                  />
                  <td dangerouslySetInnerHTML={{ __html: item.correct }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>  
      )}
    </div>
  );
}

export default Score;