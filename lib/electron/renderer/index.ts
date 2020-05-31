import { ipcRenderer } from 'electron';
import { Howl, Howler } from 'howler';

Howler.usingWebAudio = true;
let sound: Howl;
let soundId: undefined|number;
let analyser: AnalyserNode;
let dataArray: undefined|Uint8Array;

function update(): void {
  requestAnimationFrame(update);
  if (sound.playing() && dataArray) {
    analyser.getByteFrequencyData(dataArray);
    const data = dataArray.map((entry: number) => entry / 2);
    ipcRenderer.send('analyser', data);
  }
}

function getFrequencyData(): void {
  analyser = Howler.ctx.createAnalyser();
  Howler.masterGain.connect(analyser);
  analyser.fftSize = 1024;
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

export function playAudio(src: string): void {
  if (!sound) {
    initializeSound(src);
  }
  if (!sound.playing()) {
    soundId = sound.play();
    sound.on('play', () => {
      getFrequencyData();
    });
  }
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
