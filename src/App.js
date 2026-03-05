import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import Score from './components/Score';
import './App.css'


function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}


function App() {
  const [quizSettings, setQuizSettings] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("force-light", "force-dark");
    root.classList.add(theme === "dark" ? "force-dark" : "force-light");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

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

  const handleAnswer = (isCorrect, question, selectedAnswer) => {
    if (isCorrect) setScore((prev) => prev + 1);
    if (question){
      setAnswerHistory((prev) => [
        ...prev,
        {
          question: question.question,
          selected: selectedAnswer,
          correct: question.correct_answer,
        },
      ]);
    }

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
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <h1 className="header">Brain Bash</h1>

      {!quizSettings ? (
        <StartScreen onStart={startQuiz} />
      ) : questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : showScore ? (
        <Score
          score={score}
          total={questions.length}
          answerHistory={answerHistory}
        />
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