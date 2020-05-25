import blessed, { Widgets } from 'neo-blessed';
import { appendFileSync } from 'fs';
// @ts-ignore
import readLastLines from 'read-last-lines';
import { EOL } from 'os';
import getVideoList from '../google/getVideoList';
import downloadAudioStream, { getPathToAudioFile, cleanUpTempFiles } from '../utils/downloadAudioStream';
import { exitApp, getWindow } from '../electron/main';

interface AudioMapping {
  [id: string]: string;
}
const audioMapping: AudioMapping = {};

async function getLastLogEntries(searchLog: Widgets.Log): Promise<void> {
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

async function download(id: string, progressBar: Widgets.ProgressBarElement, screen: Widgets.Screen): Promise<void> {
  if (!audioMapping[id]) {
    await downloadAudioStream(id, progressBar, screen);
    const path = getPathToAudioFile();
    audioMapping[id] = path;
  }
}

async function executeInRenderer(id: string, functionName: string): Promise<void> {
  const src = audioMapping[id];
  const functionToExecute = `${functionName}('${src}');`;
  const win = getWindow();
  if (win) {
    await win.webContents.executeJavaScript(functionToExecute, true);
  }
}

async function play(id: string): Promise<void> {
  await executeInRenderer(id, 'playAudio');
}

async function pause(id: string): Promise<void> {
  await executeInRenderer(id, 'pauseAudio');
}

async function stop(id: string): Promise<void> {
  await executeInRenderer(id, 'stopAudio');
}

export default function createScreen(): void {
  const screen = blessed.screen({
    title: 'YUT - Youtube Terminal',
    smartCSR: true,
    autoPadding: true,
    fullUnicode: true,
    dockBorders: true,
  });

  const searchResultTable = blessed.listtable({
    top: 0,
    parent: screen,
    align: 'left',
    width: '80%',
    height: '80%',
    focusable: true,
    keys: true,
    mouse: true,
    border: {
      type: 'line',
    },
    style: {
      header: {
        fg: 'blue',
        bold: true,
      },
      cell: {
        fg: 'white',
        selected: {
          fg: 'black',
          bg: 'white',
        },
      },
    },
  });

  const searchLog = blessed.log({
    parent: screen,
    label: 'History',
    top: 0,
    mouse: true,
    left: '+80%',
    width: '20%',
    height: '50%',
    border: {
      type: 'line',
    },
  });

  const textbox = blessed.textbox({
    parent: screen,
    mouse: true,
    left: 0,
    top: '+80%',
    width: '100%',
    height: '20%',
    keys: true,
    border: {
      type: 'line',
    },
    input: true,
  });

  const progressBar = blessed.progressbar({
    parent: screen,
    label: 'Download progress',
    border: {
      type: 'line',
    },
    pch: '#',
    style: {
      fg: 'blue',
      bg: 'default',
      bar: {
        bg: 'default',
        fg: 'blue',
      },
      border: {
        fg: 'default',
        bg: 'default',
      },
    },
    width: '50%',
    height: 3,
    top: 'center',
    left: 'center',
    orientation: 'horizontal',
  });


  textbox.on('submit', async (data) => {
    appendFileSync('history.log', `\n${data}`);
    searchLog.add(data);
    const searchResult = await getVideoList(data);
    if (searchResult && searchResult.length > 0) {
      searchResultTable.clearItems();
      const tableData = [
        ['ID', 'Title'],
        ...searchResult,
      ];
      textbox.clearValue();
      searchResultTable.setData(tableData);
      screen.render();
      searchResultTable.focus();
    }
  });

  searchResultTable.on('select', async (data) => {
    screen.append(progressBar);
    screen.render();
    const id = data.content.split(' ')[0];
    await download(id, progressBar, screen);
    // await play(id);
  });

  progressBar.on('complete', () => {
    progressBar.destroy();
    screen.render();
  });

  screen.key(['escape', 'C-c'], () => {
    const filePaths = Object.values(audioMapping);
    cleanUpTempFiles(filePaths);
    screen.destroy();
    exitApp();
  });

  getLastLogEntries(searchLog);

  screen.append(searchResultTable);
  screen.append(searchLog);
  screen.append(textbox);

  textbox.focus();

  screen.render();
}
