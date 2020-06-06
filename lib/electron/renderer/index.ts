import { ipcRenderer } from 'electron';
import { Howl, Howler } from 'howler';
import { appendFileSync } from 'fs';

Howler.usingWebAudio = true;
let sound: Howl;
let soundId: undefined|number;
let analyser: AnalyserNode;
let dataArray: undefined|Uint8Array;
let isMuted = false;
let songPositionIntervalTimout: NodeJS.Timeout;

function getCurrentPosition() {
  songPositionIntervalTimout = setInterval(() => {
    const currentSongPosition = sound.seek(undefined, soundId) as number;
    ipcRenderer.send('currentSongPosition', currentSongPosition.toFixed(0));
  }, 1000);
}

function update(): void {
  requestAnimationFrame(update);
  if (sound.playing() && dataArray) {
    analyser.getByteFrequencyData(dataArray);
    const data = dataArray.map((entry: number) => entry / 4);
    ipcRenderer.send('analyser', data);
  }
}

function getFrequencyData(): void {
  analyser = Howler.ctx.createAnalyser();
  Howler.masterGain.connect(analyser);
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  update();
}

function initializeSound(src: string): void {
  sound = new Howl({
    src,
    html5: false,
  });
}

export function muteAudio(): void {
  if (isMuted) {
    Howler.mute(false);
    isMuted = false;
  } else {
    Howler.mute(true);
    isMuted = true;
  }
}

export function playAudio(src: string): void {
  if (!sound) {
    initializeSound(src);
  }
  if (!sound.playing()) {
    soundId = sound.play();
    sound.on('play', () => {
      getCurrentPosition();
      getFrequencyData();
    });
    sound.on('end', () => {
      clearInterval(songPositionIntervalTimout);
      ipcRenderer.send('soundEnd');
    });
  }
}

export function pauseAudio(): void {
  if (soundId) {
    clearInterval(songPositionIntervalTimout);
    sound.pause(soundId);
  }
}

export function stopAudio(): void {
  if (soundId) {
    clearInterval(songPositionIntervalTimout);
    sound.stop(soundId);
  }
}
