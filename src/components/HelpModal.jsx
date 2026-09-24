import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function HelpModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLable = 'BrainBash Help'
      className='modal'
      overlayClassName='modal-overlay'
      shouldCloseOnOverlayClick={true}
    >
      <button
        type='button'
        className='modal-close'
        onClick={onClose}
        aria-label='Close help'
      >
        ❌
      </button>

      <h2>Help & FAQs</h2>

      <div className='help-faqs'>
        <details>
          <summary>Why won't my quiz start?</summary>
          <p>
            BrainBash gets its questions from the Open Trivia Database. Occasionally, a combination of category difficulty and question type may not have enough questions available. Try changing one of your quiz settings and starting again.
          </p>
        </details>

        <details>
          <summary>Why did my questions take a moment to load?</summary>
          <p>
            Questions come from an external trivia service. If the service is busy or your connection is a little slow, BrainBash may need a moment or another attempt to fetch your quiz.
          </p>
        </details>

        <details>
          <summary> Why am I seeing a question I've seen before?</summary>
          <p>
            Questions are supplied by the Open Trivia Database, so repeats can occasionally happen between games. BrainBash does not currently keep a permanent history of every question you've played.
          </p>
        </details>

        <details>
          <summary>The timer ran out before I answered. What happened?</summary>
          <p>
            If you're playing Lightning Mode, you only have a few seconds to answer each question. Choose quickly or switch to Classic Mode for a slightly less feral trivia experience.
          </p>
        </details>

        <details>
          <summary>I can't hear any sounds.</summary>
          <p>
            Check that BrainBash isn't muted from the options menu and make sure your device or browser volume is turned up. Some browsers also prevent audio until you've interacted with the page.
          </p>
        </details>

        <details>
          <summary>How do I switch between light and dark mode?</summary>
          <p>
            Open the options menu and choose Light or Dark mode. Pick whichever tickles your fancy.
          </p>
        </details>

        <details>
          <summary>Can I restart my quiz?</summary>
          <p>
            Yep! Select Back to Start during a game to return to the beginning and choose new settings. Your current quiz progress will be reset.
          </p>
        </details>

        <details>
          <summary>Why was my answer marked wrong?</summary>
          <p>
            BrainBash checks your answer against the answer supplied by the trivia API. If something genuinely looks incorrect, please send a bug report and include the question if you can.
          </p>
        </details>

        <details>
          <summary>Does BrainBash save my scores?</summary>
          <p>
            Not permanently...yet. Your results are available during your current session, but BrainBash does not currently maintain long term player histories.
          </p>
        </details>

        <details>
          <summary>Do I need an account?</summary>
          <p>
            Nope, BrainBash is designed to let you jump straight into trivia without the need for yet another login. 
          </p>
        </details>

        <details>
          <summary>Can I play with friends?</summary>
          <p>
            Not quite yet! Multiplayer is a planned feature which will bring shareable room codes, synchronized games and eventually player chat. Stay tuned.
          </p>
        </details>

        <details>
          <summary>Something is genuinely broken. What should I do?</summary>
          <p>
            Use <b>Report A Bug</b> and tell me what happened, what you were doing when it happened, and which game mode you were using if you remember. You can optionally leave your email if you'd like a response.
          </p>
        </details>

        <details>
          <summary>What if I have a suggestion for improvements?</summary>
          <p>
            You can use <b>Report a Bug</b> to suggest anything you think would make BrainBash better. 
          </p>
        </details>

        <details>
          <summary>Can I submit a question to the Open Trivia Database?</summary>
          <p>
            YES! You can do that <b><a href="https://opentdb.com/" target="_blank">here!</a></b>
          </p>
        </details>
      </div>
    </Modal>
  );
}