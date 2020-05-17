import { Howl } from 'howler';

export default function playAudio(): void {
  const sound = new Howl({
    src: 'sample.mp4',
  });
  sound.play();
}
