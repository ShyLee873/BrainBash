import React, { useState, useEffect } from 'react';

export default function StartScreen({ onStart }) {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [amount, setAmount] = useState(5);
  const [categories, setCategories] = useState([]);
  const [mode, setMode] = useState("classic") 

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ category, difficulty, amount, mode });
  };

  return (
    <div className="start-screen">
      <h2>Welcome to Brain Bash!</h2>
      <form className="start-options" onSubmit={handleSubmit}>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any</option>
            {[...categories]
              .sort((a, b) => {
                const getClean = (name) =>
                  name.includes(':') ? name.split(':')[1] : name;

                return getClean(a.name).localeCompare(getClean(b.name));
              })
              .map((cat) => {
                const cleanName = cat.name.includes(':')
                  ? cat.name.split(':')[1]
                  : cat.name;

                return (
                  <option key={cat.id} value={cat.id}>
                    {cleanName}
                  </option>
                );
              }
            )}
          </select>
        </label>

        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Number of Questions:
          <input
            type="number"
            min="1"
            max="50"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || '')}
          />
        </label>

        <div className="mode-group">
          <span className="mode-label">Game Mode:</span>

          <label className="mode-option">
            <input
              type="radio"
              value="classic"
              name="mode"
              checked={mode === "classic"}
              onChange={(e) => setMode(e.target.value)}
            />
            Classic
          </label>

          <label className="mode-option tooltip">
            <input
              type="radio"
              value="lightning"
              name="mode"
              checked={mode === "lightning"}
              onChange={(e) => setMode(e.target.value)}
            />
            Lightning
          </label>
        </div>

        <button className="start-button" type="submit">Start Quiz</button>
      </form>
    </div>
  );
}