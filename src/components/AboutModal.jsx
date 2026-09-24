import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function AboutModal({ isOpen, onClose }){
  return(
    <Modal 
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel='About Brain Bash'
      className='modal'
      overlayClassName='modal-overlay'
      shouldCloseOnOverlayClick={true}
      >
      <button 
        type= "button" 
        className='modal-close' 
        onClick={onClose}
        aria-label="Close about modal"
        >
          ❌
        </button>

      <h3>About</h3>

      <p>
          BrainBash is a React-based trivia game built around fast gameplay, configurable quiz settings, score tracking, and just enough chaos to make knowing obscure facts feel useful.
      </p>
      
      <h3>Under the Hood</h3>

      <p>
        The current frontend is built with React and Javascript, using component state to manage gameplay, question progression, timers, scoring, theme preferences, and audio controls.
      </p>

      <p>
        Trivia data is retrieved from the Open Trivia Database API, with client side handling for loading states, retries, malformed responses, and game configuration.
      </p>

      <h3>What's Next?</h3>

      <p>
        BrainBash will be evolving from a client-side trivia game into a multiplayer application backed by Elixir and Phoenix.
      </p>

      <ul className='modal-list'>
        <li>
          Phoenix backend for multiplayer game coordination
        </li>
        <li>
          Shareable room codes with no account or authorization required
        </li>
        <li>
          Temporary server-side game state managed with Elixir processes
        </li>
        <li>
          Phoenix Channels and PubSub for real-time player updates
        </li>
        <li>
          Synchronized questions, answers, scroes and game state
        </li>
        <li>
          Multiplayer chat
        </li>
        <li>
          Persistent game history and player profiles later on
        </li>
      </ul>

      <p>
        The first multiplayer version will intentionally avoid authentication and a database, keeping rooms lightweight and temporary while the real-time architecture is developed. 
      </p>
    </Modal>
  );
}