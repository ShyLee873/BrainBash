import React, { useState, useRef, useEffect, useCallback } from 'react';
import Nav from './components/Nav';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import Score from './components/Score';
import './App.css'
import useSound from './components/Sound';


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
  const LIGHTNING_TIME = 7;
  const [timeLeft, setTimeLeft] = useState(LIGHTNING_TIME);
  const [timeUp, setTimeUp] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const isLightningMode = quizSettings?.mode === "lightning";
  const { playSound, stopAudio, stopAllSounds } = useSound();
  const [muted, setMuted] = useState(false);
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

  const toggleMute = () => {
    setMuted(prevMuted => {
      const nextMuted = !prevMuted;

      if (nextMuted) {
        stopAllSounds();
      }

      return nextMuted;
    });
  };

  // Timer effect
  useEffect(() => {
    if (!quizSettings || showScore) return;
    if (!isLightningMode) return;
    if (questions.length === 0) return;
    if (timeUp) return;
    if (questionAnswered) return;

    if (timeLeft <= 0) {
      setTimeUp(true);
      if (!muted) {
        stopAudio('countdown');
        playSound('incorrect');
      }
      return;
    }

    if (timeLeft === 3 && !muted) {
      playSound('countdown');
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [quizSettings, questions, showScore, timeLeft, timeUp, isLightningMode, questionAnswered]);

  // Reset timer when question changes
  useEffect(() => {
    if (isLightningMode) {
      setTimeLeft(LIGHTNING_TIME);
      setTimeUp(false);
      setQuestionAnswered(false);
    }
  }, [currentIndex, quizSettings, isLightningMode]);

  // Tiny pause when time runs out
  useEffect(() => {
    if (!timeUp) return;
    if (!isLightningMode) return;

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    const timeoutId = setTimeout(() => {
      handleAnswer(false, currentQuestion, null);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [timeUp, quizSettings, questions, currentIndex]);

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
    lastRequestKeyRef.current = null;
    setQuizSettings({ ...settings });
    setQuestions([]);
    setError(null);
    setScore(0);
    setCurrentIndex(0);
    setShowScore(false);
    setAnswerHistory([]);
    setQuestionAnswered(false);
    setRetryTick(0);
    setTimeLeft(LIGHTNING_TIME);
    setTimeUp(false);
  };

  const newQuiz = () => {
    setQuizSettings(null);
    setQuestions([]);
    setError(null);
    setScore(0);
    setCurrentIndex(0);
    setShowScore(false);
    setAnswerHistory([]);
    setQuestionAnswered(false);
    setRetryTick(0);
    setTimeLeft(LIGHTNING_TIME);
    setTimeUp(false);
  };

  const isQuestionScreen = !!quizSettings && !showScore;

  return (
    <div className="App">
      <Nav theme={theme} 
      onToggleTheme={toggleTheme} 
      showQuestionActions={isQuestionScreen}
      onToggleMute={toggleMute} 
      muted={muted}
      />
      <h1 className="header">Brain Bash</h1>

      {!quizSettings ? (
        <StartScreen onStart={startQuiz} />
      ) : loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <div>
          <button type="button" className="retryBtn" onClick={retryFetch}>
            Retry
          </button>
          <p>{error}</p>
          <button type="button" className="backToStart" onClick={() => setQuizSettings(null)}>
            Back to Start
          </button>
        </div>
      ) : showScore ? (
        <Score
          score={score}
          total={questions.length}
          answerHistory={answerHistory}
          quizSettings={quizSettings}
          startQuiz={startQuiz}
          newQuiz={newQuiz}
          muted={muted}
        />
      ) : questions[currentIndex] ? (
        <Question
          question={questions[currentIndex]}
          handleAnswer={handleAnswer}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          mode={quizSettings?.mode}
          timeLeft={timeLeft}
          setQuestionAnswered={setQuestionAnswered}
        />
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}