import { Howl } from 'howler';

let sound: Howl;
let soundId: undefined|number;

function initializeSound(src: string): void {
  sound = new Howl({
    src,
  });
}

export function playAudio(src: string): void {
  if (!sound) {
    initializeSound(src);
  }
  soundId = sound.play();
}

export function pauseAudio(): void {
  if (soundId) {
    sound.pause(soundId);
  }
}

export function stopAudio(): void {
  if (soundId) {
    sound.stop(soundId);
  }
}
