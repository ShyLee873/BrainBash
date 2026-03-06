import React, { useState, useRef, useEffect, useCallback } from 'react';
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

export default function App() {
  const [quizSettings, setQuizSettings] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme);
  const [retryTick, setRetryTick] = useState(0);
    // StrictMode guard to prevent double fetch for same request in dev
  const lastRequestKeyRef = useRef(null);
  const retryFetch = useCallback (() => {
    setRetryTick((n) => n + 1);
  }, []);

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

    // Stable request key for StrictMode guard
    const requestKey = apiUrl;

    // If StrictMode runs effect twice with same settings, skip duplicate
    if (lastRequestKeyRef.current === requestKey && retryTick === 0) return;
    lastRequestKeyRef.current = requestKey;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(apiUrl, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if(data.response_code === 0 && Array.isArray(data.results)) {
          setQuestions(data.results);
        } else {
          setQuestions([]);
          setError("No questions found for those settings. Try different options.");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setQuestions([]);

        if (String(err.message).includes("HTTP 429")) {
          setError("Rate limited (429). Wait a moment, then hit Retry")
        } else {
          setError("Could not load questions. Please try again.")
        }
      })
      .finally (() => setLoading(false));

      return () => controller.abort();
    }, [quizSettings, retryTick]);
  //   fetch(apiUrl)
  //     .then((res) => res.json())
  //     .then((data) => setQuestions(Array.isArray(data.results) ? data.results : []))
  //     .catch(() => setQuestions([]));
  // }, [quizSettings]);

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
    setQuestions([]);
    setError(null);
    setScore(0);
    setCurrentIndex(0);
    setShowScore(false);
    setAnswerHistory([]);
  };

  return (
    <div className="App">
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <h1 className="header">Brain Bash</h1>

      {!quizSettings ? (
        <StartScreen onStart={startQuiz} />
      ) : loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <div>
          <button type="button" onClick={retryFetch}>
            Retry
          </button>
          <p>{error}</p>
          <button type="button" onClick={() => setQuizSettings(null)}>
            Back to Start
          </button>
        </div>
      ) : showScore ? (
        <Score
          score={score}
          total={questions.length}
          answerHistory={answerHistory}
        />
      ) : questions[currentIndex] ? (
        <Question
          question={questions[currentIndex]}
          handleAnswer={handleAnswer}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
        />
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}