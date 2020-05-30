import { ipcRenderer } from 'electron';
import { Howl, Howler } from 'howler';

Howler.usingWebAudio = true;
let sound: Howl;
let soundId: undefined|number;

function getFrequencyData(): any {
  const analyser = Howler.ctx.createAnalyser();
  Howler.masterGain.connect(analyser);
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  setInterval(() => {
    if (sound.playing()) {
      analyser.getByteTimeDomainData(dataArray);
      const data = dataArray.map((entry: number) => entry / 2);
      ipcRenderer.send('analyser', data);
    }
  }, 1000);
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
    clearInterval();
  }
}

export function stopAudio(): void {
  if (soundId) {
    sound.stop(soundId);
    clearInterval();
  }
}
