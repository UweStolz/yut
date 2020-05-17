import { createWriteStream } from 'fs';
import { tmpNameSync } from 'tmp';
import ytdl, { downloadOptions } from 'ytdl-core';

function getTmpFilePath(): string {
  const randomName = tmpNameSync();
  const tmpFilePath = `${randomName}.mp4`;
  return tmpFilePath;
}

export default function downloadAudioStream(id: string): void {
  const url = `http://www.youtube.com/watch?v=${id}`;
  const options: downloadOptions = {
    filter: 'audioonly',
    quality: 'highest',
  };
  try {
    const tmpFilePath = getTmpFilePath();
    const audioStream = ytdl(url, options);
    const writeStream = createWriteStream(tmpFilePath, {
      autoClose: true,
      emitClose: true,
    });
    audioStream.pipe(writeStream);
  } catch (err) {
    console.error(err);
  }
}
