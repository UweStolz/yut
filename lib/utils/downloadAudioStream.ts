import { createWriteStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { tmpNameSync } from 'tmp';
import ytdl, { downloadOptions } from 'ytdl-core';

const tmpDirFromOS = tmpdir();

function getTmpFilePath(): string {
  const randomName = tmpNameSync();
  const tmpFileName = `${randomName}.mp4`;
  const tmpFilePath = join(tmpDirFromOS, tmpFileName); // `${tmpDirFromOS}/${tmpFileName}`;
  return tmpFilePath;
}

export default function downloadAudioStream(id: string) {
  const url = `http://www.youtube.com/watch?v=${id}`;
  const options: downloadOptions = {
    filter: 'audioonly',
    quality: 'highest',
  };
  try {
    const tmpFilePath = getTmpFilePath();
    const audioStream = ytdl(url, options);
    audioStream.pipe(createWriteStream(tmpFilePath));
  } catch (err) {
    console.error(err);
  }
}
