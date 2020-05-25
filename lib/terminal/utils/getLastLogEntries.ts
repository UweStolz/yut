// @ts-ignore
import readLastLines from 'read-last-lines';
import { EOL } from 'os';
import { Widgets } from 'neo-blessed';

export default async function getLastLogEntries(searchLog: Widgets.Log): Promise<void> {
  try {
    const lastLogEntries = await readLastLines.read('history.log', 20) as string;
    const lastLines = lastLogEntries.split(EOL);
    lastLines.forEach((line) => {
      const trimmedEntry = line.trim();
      searchLog.add(trimmedEntry);
    });
  } catch {
    // Do nothing
  }
}
