// src/App.js
import React, { useState, useEffect } from 'react';
import Question from './components/Question';
import Score from './components/Score';
import './App.css'

const API_URL = 'https://opentdb.com/api.php?amount=5&type=multiple';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setQuestions(data.results));
  }, []);

  const handleAnswer = (isCorrect) => {
    if (!questions) {
      return;
    }
    if (isCorrect) setScore(score + 1);
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="App">
      <h1 className='header'>Brain Bash</h1>
      {questions.length > 0 ? (
        showScore ? (
          <Score score={score} total={questions.length} />
        ) : (
          <Question
            question={questions[currentIndex]}
            handleAnswer={handleAnswer}
          />
        )
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default App;
