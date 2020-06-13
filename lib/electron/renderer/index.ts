import { ipcRenderer } from 'electron';
import { Howl, Howler } from 'howler';

Howler.usingWebAudio = true;
let sound: Howl;
let soundId: undefined|number;
let analyser: undefined|AnalyserNode;
let dataArray: undefined|Uint8Array;
let songPositionIntervalTimout: NodeJS.Timeout;
let shouldLoop = false;

function getCurrentPosition() {
  songPositionIntervalTimout = setInterval(() => {
    const currentSongPosition = sound.seek(undefined, soundId) as number;
    ipcRenderer.send('currentSongPosition', currentSongPosition.toFixed(0));
  }, 1000);
}

function update(): void {
  const frame = requestAnimationFrame(update);
  if (sound.playing() && dataArray && analyser) {
    analyser.getByteFrequencyData(dataArray);
    const data = dataArray.map((entry: number) => entry / 4);
    ipcRenderer.send('analyser', data);
  } else {
    cancelAnimationFrame(frame);
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

function resetAnalyser() {
  clearInterval(songPositionIntervalTimout);
  if (analyser) {
    analyser.disconnect();
    analyser = undefined;
    dataArray = undefined;
  }
}

function initializeSound(src: string): void {
  sound = new Howl({
    src,
    html5: false,
  });
}

export function muteAudio(): void {
  Howler.mute(true);
}

export function unmuteAudio(): void {
  Howler.mute(false);
}

export function enableLoopAudio(): void {
  shouldLoop = true;
  if (soundId) {
    sound.loop(true, soundId);
  }
}

export function disableLoopAudio(): void {
  shouldLoop = false;
  if (soundId) {
    sound.loop(false, soundId);
  }
}

export function playAudio(src: string): void {
  if (!sound) {
    initializeSound(src);
  }
  if (!sound.playing()) {
    soundId = sound.play(soundId);
    sound.once('play', () => {
      if (shouldLoop) { sound.loop(true, soundId); }
      getCurrentPosition();
      getFrequencyData();
    });
    sound.once('end', () => {
      if (sound.loop(soundId)) {
        getCurrentPosition();
        getFrequencyData();
      } else {
        resetAnalyser();
        ipcRenderer.send('soundEnd');
      }
    });
    sound.once('loaderror', () => {
      resetAnalyser();
      ipcRenderer.send('soundEnd');
    });
    sound.once('playerror', () => {
      resetAnalyser();
      ipcRenderer.send('soundEnd');
    });
  }
}

export function pauseAudio(): void {
  if (soundId) {
    sound.pause(soundId);
    resetAnalyser();
  }
}

export function stopAudio(): void {
  if (soundId) {
    resetAnalyser();
    sound.stop(soundId);
  }
}
