import { EOL } from 'os';
import { Widgets } from 'blessed';
import { readFileSync, existsSync, writeFileSync } from './fs';

function writeNewFile(data: string[]): void {
  try {
    const fileWithNewlines = data.map((line) => line + EOL);
    const cleanFile = fileWithNewlines.toString().replace(/,/g, '');
    writeFileSync('history.log', cleanFile);
  } catch {
    // Silently ignore error
  }
}

function getLogFile(): string[] {
  let splitFileText: string[] = [];
  try {
    const fileBuffer = readFileSync('history.log');
    const fileText = fileBuffer.toString();
    splitFileText = fileText.split(EOL);
    const lineCount = splitFileText.length - 1;
    if (lineCount > 100) {
      const startPoint = lineCount - 101;
      const reducedLog = splitFileText.splice(startPoint);
      splitFileText = reducedLog;
      writeNewFile(splitFileText);
    }
  } catch {
    // Silently ignore error
  }
  return splitFileText;
}

export default async function getLastLogEntries(searchLog: Widgets.Log): Promise<void> {
  try {
    const doesFileExist = existsSync('history.log');
    if (doesFileExist) {
      const lastLines = getLogFile();
      lastLines.forEach((line) => {
        if (line.length > 0) {
          const trimmedEntry = line.trim();
          searchLog.add(trimmedEntry);
        }
      });
    }
  } catch {
    // Silently ignore error
  }
}
