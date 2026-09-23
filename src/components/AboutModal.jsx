import React from 'react';
import Modal from 'react-modal';
// Don't forget to create and import AboutModal.css

Modal.setAppElement('#root');

export default function AboutModal({ isOpen, onClose }){
  return(
    <Modal 
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel='About Brain Bash'
      className='replay-modal'
      overlayClassName='replay-modal-overlay'
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

      <h2>About</h2>
      <p>Brain bash is an app</p>
    </Modal>
  );
}