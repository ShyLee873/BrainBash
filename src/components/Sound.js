import { useRef } from 'react';

export default function useSound() {
  const sounds = useRef({
    incorrect: new Audio('/sounds/incorrect.wav'),
    correct: new Audio('/sounds/correct.wav'),
    countdown: new Audio('/sounds/countdown-click.wav'),
    fail: new Audio('/sounds/fail.mp3'),
    win: new Audio('/sounds/victory.wav'),
  });

  const stopAudio = (soundName) => {
    const audio = sounds.current[soundName];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const stopAllSounds = () => {
    Object.values(sounds.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  const playSound = (soundName) => {
    stopAudio(soundName);
    sounds.current[soundName]?.play().catch((error) => {
      console.error(`Could not play ${soundName}: `, error);
    });
  };

  return { playSound, stopAudio, stopAllSounds };
}