import React from 'react';
import Modal from 'react-modal';
import './ReplayModal.css';

Modal.setAppElement('#root');

export default function ReplayModal({ isOpen, onClose, onReplaySame, onNewQuiz }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel='Play Again Options'
      className='replay-modal'
      overlayClassName='replay-modal-overlay'
      shouldCloseOnOverlayClick={true}
    >
      <button className='modal-close' onClick={onClose}>❌</button>

      <h2>Quick question...</h2>
      <p>Replay with the same settings or start a new quiz?</p>
      
      <div className='replay-modal-buttons'>
        <button className='replay' onClick={onReplaySame}>Replay</button>

        <button className='replay' onClick={onNewQuiz}>New Quiz</button>
      </div>
    </Modal>
  );
}