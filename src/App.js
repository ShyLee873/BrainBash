import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import Score from './components/Score';
import './App.css'

function App() {
  const [quizSettings, setQuizSettings] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Fetch questions once quizSettings is set
  useEffect(() => {
    if (!quizSettings) return;

    const { category, difficulty, amount } = quizSettings;
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (category) apiUrl += `&category=${category}`;
    if (difficulty) apiUrl += `&difficulty=${difficulty}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setQuestions(data.results));
  }, [quizSettings]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((prev) => prev + 1);
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowScore(true);
    }
  };

  const startQuiz = (settings) => {
    setQuizSettings(settings);
    setScore(0);
    setCurrentIndex(0);
    setShowScore(false);
    setQuestions([]);
  };

  return (
    <div className="App">
      <h1 className="header">Brain Bash</h1>

      {!quizSettings ? (
        <StartScreen onStart={startQuiz} />
      ) : questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : showScore ? (
        <Score score={score} total={questions.length} />
      ) : (
        <Question
          question={questions[currentIndex]}
          handleAnswer={handleAnswer}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
        />
      )}
    </div>
  );
}

export default App;