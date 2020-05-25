import blessed, { Widgets } from 'neo-blessed';
import { appendFileSync } from 'fs';
import getVideoList from '../google/getVideoList';
import utils from './utils';
import { exitApp } from '../electron/main';

interface AudioMapping {
  [id: string]: string;
}
const audioMapping: AudioMapping = {};

async function download(id: string, progressBar: Widgets.ProgressBarElement, screen: Widgets.Screen): Promise<void> {
  if (!audioMapping[id]) {
    await utils.downloadAudioStream(id, progressBar, screen);
    const path = utils.getPathToAudioFile();
    audioMapping[id] = path;
  }
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
    parent: screen,
    mouse: true,
    left: 0,
    top: '+80%',
    width: '80%',
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
    // utils.mediaControls.playMedia(id, audioMapping);
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

  const nodes = [
    searchResultTable,
    searchLog,
    textbox,
  ];

  nodes.forEach((node) => {
    screen.append(node);
    node.enableMouse();
    node.enableKeys();
    screen.focusPush(node);
  });

  utils.getLastLogEntries(searchLog);

  textbox.focus();

  screen.render();
}
