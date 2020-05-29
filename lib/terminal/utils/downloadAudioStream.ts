import { createWriteStream, unlinkSync } from 'fs';
import { tmpNameSync } from 'tmp';
import ytdl, { downloadOptions } from 'ytdl-core';
import { Widgets } from 'blessed';
import { resolve as resolvePath } from 'path';

let path: string;

export function getPathToAudioFile(): string {
  return path;
}

export function cleanUpTempFiles(filePaths: string[]): void {
  filePaths.forEach((pathToFile) => {
    try {
      unlinkSync(pathToFile);
    } catch (err) {
      // Silently ignore error
    }
  });
}

function setTmpFilePath(): void {
  const randomName = tmpNameSync();
  const tmpFilePath = `${randomName}.mp4`;
  const fullPath = resolvePath(tmpFilePath);
  path = fullPath;
}

export default async function downloadAudioStream(id: string, progressBar: Widgets.ProgressBarElement, screen: Widgets.Screen): Promise<void> {
  return new Promise((resolve) => {
    const url = `http://www.youtube.com/watch?v=${id}`;
    const options: downloadOptions = {
      filter: 'audioonly',
      quality: 'highest',
    };
    setTmpFilePath();
    const audioStream = ytdl(url, options);
    const writeStream = createWriteStream(path, {
      autoClose: true,
      emitClose: true,
    });
    audioStream.on('progress', (chunk, totalDownloaded, total) => {
      const percentageDownloaded = (totalDownloaded / total) * 100;
      progressBar.setProgress(percentageDownloaded);
      screen.render();
    });
    audioStream.on('end', () => {
      resolve();
    });
    audioStream.pipe(writeStream);
  });
}
