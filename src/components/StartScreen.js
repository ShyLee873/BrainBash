import React, { useState, useEffect } from 'react';

function StartScreen({ onStart }) {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [amount, setAmount] = useState(5);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ category, difficulty, amount });
  };

  return (
    <div className="start-screen">
      <h2>Welcome to Brain Bash!</h2>
      <form className="start-options" onSubmit={handleSubmit}>
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
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
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <button className="start-button" type="submit">Start Quiz</button>
      </form>
    </div>
  );
}

export default StartScreen;