import React, { useState, useEffect } from 'react';
import './Question.css';

const correctSound = new Audio('/sounds/correct.wav');
const incorrectSound = new Audio('/sounds/incorrect.wav');

export default function Question({ question, handleAnswer, currentIndex, totalQuestions, mode, timeLeft, setQuestionAnswered }) {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [, setIsCorrect] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  useEffect(() => {
    if (!question) return;

    const answers = [
      ...question.incorrect_answers,
      question.correct_answer,
    ];

    // Shuffle answers
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    setShuffledAnswers(answers);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimedOut(false);
  }, [question]);

  useEffect(() =>{
    if (mode === "lightning" && timeLeft <= 0 && !selectedAnswer) {
      setTimedOut(true);
    }
  }, [mode, timeLeft, selectedAnswer]);

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleSelect = (answer) => {
    if (selectedAnswer) return;
    if (mode === "lightning" && timeLeft <= 0) return;

    setSelectedAnswer(answer);
    setQuestionAnswered(true);
    
    const correct = answer === question.correct_answer;
    setIsCorrect(correct);
    correct ? correctSound.play() : incorrectSound.play();

    if (mode === "lightning") {
      setTimeout(() => {
        handleNext(answer);
      }, 800);
    }
  };

  const handleNext = (answerToSubmit = selectedAnswer) => {
    handleAnswer(
      answerToSubmit === question.correct_answer,
      question,
      answerToSubmit
    );
  };

  const maxTime = 7;
  const timerPercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const timerClass = mode === "lightning" && timeLeft <= 3 ? "timer timingOut" : "timer";

  return (
    <div className="question-card">
      <div className="question-panel">
        {mode === "lightning" && (
          <div className="timer-wrapper">
            <p className={timerClass}>⏱ {timeLeft}</p>
            <div className="timer-bar">
              <div
                className={`timer-fill ${timeLeft <= 3 ? 'timer-fill-warning' : ''}`}
                style={{ width: `${timerPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        <h2 className="question-text">{decodeHtml(question.question)}</h2>
      </div>

      <div className="answer-buttons">
        {shuffledAnswers.map((answer, index) => {
          let className = 'answerButton';
          if (selectedAnswer) {
            if (answer === question.correct_answer) className += ' correct';
            else if (answer === selectedAnswer) className += ' incorrect';
          } else if (timedOut) {
            if (answer === question.correct_answer) className += ' correct';
            else className += ' incorrect';
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleSelect(answer)}
              disabled={!!selectedAnswer || timedOut}
            >
              {decodeHtml(answer)}
            </button>
          );
        })}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
          }}
        ></div>
      </div>

      <p className="question-count">{currentIndex + 1} of {totalQuestions}</p>
    
      {mode === 'classic' && selectedAnswer && (
        <div className="feedback">
          <button className="next-button" onClick={() => handleNext()}>
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}