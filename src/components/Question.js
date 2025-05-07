import React, { useState, useEffect } from 'react';

function Question({ question, handleAnswer }) {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    // Mix correct and incorrect answers
    const answers = [
      ...question.incorrect_answers,
      question.correct_answer,
    ];

    // Shuffle using Fisher-Yates
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    setShuffledAnswers(answers);
  }, [question]);

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="question-card">
      <h2 className='question-text'>{decodeHtml(question.question)}</h2>
      <div className="answer-buttons">
        {shuffledAnswers.map((answer, index) => (
          <button
            className='answerButton'
            key={index}
            onClick={() => handleAnswer(answer === question.correct_answer)}
          >
            {decodeHtml(answer)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;