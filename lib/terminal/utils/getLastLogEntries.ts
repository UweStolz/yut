// @ts-ignore
import readLastLines from 'read-last-lines';
import { EOL } from 'os';
import { Widgets } from 'blessed';

export default async function getLastLogEntries(searchLog: Widgets.Log): Promise<void> {
  try {
    const lastLogEntries = await readLastLines.read('history.log', 25) as string;
    const lastLines = lastLogEntries.split(EOL);
    lastLines.forEach((line) => {
      const trimmedEntry = line.trim();
      searchLog.add(trimmedEntry);
    });
  } catch {
    // Do nothing
  }
}
