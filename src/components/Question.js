import React, { useState, useEffect } from 'react';
import './Question.css';

const correctSound = new Audio('/sounds/correct.wav');
const incorrectSound = new Audio('/sounds/incorrect.wav');

function Question({ question, handleAnswer, currentIndex, totalQuestions }) {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [, setIsCorrect] = useState(null);

  useEffect(() => {
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
  }, [question]);

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === question.correct_answer;
    setIsCorrect(correct);
    correct ? correctSound.play() : incorrectSound.play();
  };

  const handleNext = () => {
    handleAnswer(
      selectedAnswer === question.correct_answer,
      question,
      selectedAnswer
    );
  };

  return (
    <div className="question-card">
      <h2 className="question-text">{decodeHtml(question.question)}</h2>
      <div className="answer-buttons">
        {shuffledAnswers.map((answer, index) => {
          let className = 'answerButton';
          if (selectedAnswer) {
            if (answer === question.correct_answer) className += ' correct';
            else if (answer === selectedAnswer) className += ' incorrect';
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleSelect(answer)}
              disabled={!!selectedAnswer}
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
      {selectedAnswer && (
        <div className="feedback">
          {/* {isCorrect ? '✅ Correct!' : '❌ Oops!'} */}
          <button className="next-button" onClick={handleNext}>Next Question</button>
        </div>
      )}
    </div>
  );
}

export default Question;
