import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { randomBytes, pseudoRandomBytes } from 'crypto';
import { existsSync } from './fs';

const possibleChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
let retries = 10;

function getOSTmpDir(): string {
  const tmpDir = tmpdir();
  return tmpDir;
}

function getRandomChars(stringLength: number): string {
  const randomChars: string[] = [];
  let randomBytesBuffer: Buffer|null = null;

  try {
    randomBytesBuffer = randomBytes(stringLength);
  } catch (err) {
    randomBytesBuffer = pseudoRandomBytes(stringLength);
  }

  for (let i = 0; i < stringLength; i += 1) {
    randomChars.push(possibleChars[randomBytesBuffer[i] % possibleChars.length]);
  }

  const randomCharString = randomChars.join('');
  return randomCharString;
}

export default function getRandomTempName(length: number, fileExtension: string, prefix = 'tmp-'): string {
  const tmpDir = getOSTmpDir();
  const randomChars = getRandomChars(length);
  const randomPath = join(tmpDir, prefix + randomChars + fileExtension);
  const resolvedPath = resolve(randomPath);
  const doesFileAlreadyExist = existsSync(randomPath);
  if (doesFileAlreadyExist) {
    if (retries <= 0) {
      throw Error('Could not generate unique file name!');
    }
    retries -= 1;
    getRandomTempName(length, fileExtension);
  }
  return resolvedPath;
}
