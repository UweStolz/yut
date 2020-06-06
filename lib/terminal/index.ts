import blessed, { Widgets } from 'blessed';
import { appendFileSync, existsSync } from 'fs';
import { ipcMain } from 'electron';
import calculatePoints from './calculatePoints';
import performSearch from '../google/getVideoList';
import * as utils from './utils';
import { exitApp } from '../electron/main';
import mediaController from './mediaController';


interface AudioMapping {
  [id: string]: string;
}

const currentId = '';
const audioMapping: AudioMapping = {};
let currentSongTotalLength: string;

async function download(id: string, progressBar: Widgets.ProgressBarElement, screen: Widgets.Screen): Promise<void> {
  if (!audioMapping[id]) {
    await utils.downloadAudioStream(id, progressBar, screen);
    const path = utils.getPathToAudioFile();
    audioMapping[id] = path;
  }
}

export function getMediaSrc(): string {
  const src = audioMapping[currentId];
  return src;
}

export default function createScreen(): void {
  const screen = blessed.screen({
    title: 'YUT - Youtube Terminal',
    smartCSR: true,
    autoPadding: true,
    fullUnicode: true,
    dockBorders: true,
    sendFocus: true,
  });

  const searchResultTable = blessed.listtable({
    top: 0,
    parent: screen,
    label: 'Search results',
    align: 'left',
    width: '80%',
    height: '80%',
    shrink: false,
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
    focusable: true,
    keys: true,
    mouse: true,
    left: '+80%',
    width: '20%',
    height: '40%',
    border: {
      type: 'line',
    },
    scrollback: 100,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'blue',
      },
      style: {
        inverse: true,
      },
    },
  });

  const textbox = blessed.textbox({
    label: 'Command line interface',
    parent: screen,
    mouse: true,
    left: 0,
    top: '+80%',
    width: '60%',
    height: '20%',
    keys: true,
    border: {
      type: 'line',
    },
    input: true,
  });

  const informationBox = blessed.textbox({
    label: 'Song information',
    parent: screen,
    mouse: false,
    keys: false,
    input: false,
    left: '+60%',
    top: '+80%',
    width: '20%',
    height: '20%',
    border: {
      type: 'line',
    },
  });

  const progressBar = blessed.progressbar({
    parent: screen,
    label: 'Download progress',
    border: {
      type: 'line',
    },
    pch: '❚',
    shadow: true,
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

  const barChart = blessed.box({
    parent: screen,
    focusable: false,
    clickable: false,
    keys: false,
    mouse: false,
    input: false,
    keyable: false,
    draggable: false,
    label: 'Visualization',
    valign: 'bottom',
    align: 'center',
    top: '+55%',
    left: '+80%',
    width: '20%',
    height: '45%',
    border: {
      type: 'line',
    },
  });

  const loadingBox = blessed.loading({
    parent: screen,
    border: 'line',
    height: 5,
    width: 20,
    top: 'center',
    left: 'center',
    align: 'center',
  });

  const controller = mediaController(screen);

  textbox.on('submit', async (data) => {
    if (data.length > 0) {
      screen.append(loadingBox);
      loadingBox.load('Loading search results..');
      screen.render();
      appendFileSync('history.log', `\n${data}`);
      searchLog.add(data);
      const searchResult = await performSearch(data);
      loadingBox.stop();
      loadingBox.destroy();
      if (searchResult && searchResult.length > 0) {
        searchResultTable.clearItems();
        const tableData = [
          ['ID', 'Title', 'Duration'],
          ...searchResult,
        ];
        textbox.clearValue();
        searchResultTable.setData(tableData);
        screen.render();
        searchResultTable.focus();
      }
    }
  });

  searchResultTable.on('select', async (data) => {
    const selectedLine = data.content.trim().split(' ');
    const id = selectedLine[0];
    currentSongTotalLength = utils.formatTotalSongLength(selectedLine[selectedLine.length - 1]);
    const doesFileExist = existsSync(audioMapping[id]);
    if (!doesFileExist) {
      screen.append(progressBar);
      screen.render();
      await download(id, progressBar, screen);
    }
    const src = audioMapping[id];
    await utils.mediaControls.playMedia(src);
  });

  ipcMain.on('currentSongPosition', (event, arg) => {
    let currenTimeStamp = '';
    if (currentSongTotalLength.length >= 6) {
      currenTimeStamp = new Date(arg * 1000).toISOString().substr(11, 8);
    } else {
      currenTimeStamp = new Date(arg * 1000).toISOString().substr(14, 5);
    }
    const content = `${currenTimeStamp}/${currentSongTotalLength}`;
    informationBox.setContent(content);
    screen.render();
  });

  ipcMain.on('soundEnd', () => {
    informationBox.setContent('');
    barChart.setContent('');
    screen.render();
  });

  ipcMain.on('analyser', (event, arg) => {
    const data = calculatePoints(arg);
    barChart.setContent(data);
    screen.render();
  });

  progressBar.on('complete', () => {
    progressBar.destroy();
    screen.render();
  });

  screen.key(['escape', 'C-c'], () => {
    const filePaths = Object.values(audioMapping);
    utils.cleanUpTempFiles(filePaths);
    screen.destroy();
    exitApp();
  });

  const nodesWithInput = [
    searchResultTable,
    searchLog,
    textbox,
    controller,
  ];

  const nodesWithoutInput = [
    informationBox,
    barChart,
  ];

  nodesWithoutInput.forEach((node) => {
    screen.append(node);
  });

  nodesWithInput.forEach((node) => {
    screen.append(node);
    node.enableMouse();
    node.enableKeys();
  });

  utils.getLastLogEntries(searchLog);

  textbox.focus();

  screen.render();
}
