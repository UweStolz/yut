import blessed from 'blessed';
import getVideoList, { SearchResult } from './google/getVideoList';

let tempSearchResult: SearchResult[] = [];

function createScreen(): void {
  const screen = blessed.screen({
    title: 'YUT - Youtube Terminal',
    smartCSR: true,
    autoPadding: true,
    fullUnicode: true,
    dockBorders: true,
  });

  const searchResultBox = blessed.list({
    top: 0,
    parent: screen,
    width: '100%',
    height: '80%',
    content: 'Search results:',
    keys: true,
    vi: true,
    mouse: true,
    border: {
      type: 'line',
    },
    style: {
      selected: {
        fg: 'black',
        bg: 'white',
      },
    },
  });

  const textbox = blessed.textbox({
    parent: screen,
    mouse: true,
    vi: true,
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

  textbox.on('submit', async (data) => {
    const searchResult = await getVideoList(data);
    if (searchResult && searchResult.length > 0) {
      tempSearchResult = searchResult;
      searchResultBox.clearItems();
      searchResult.forEach((item) => {
        searchResultBox.addItem(item.title);
      });
      searchResultBox.render();
    }
  });

  screen.key(['escape', 'C-c'], () => process.exit(0));

  screen.append(searchResultBox);

  screen.append(textbox);

  textbox.focus();

  screen.render();
}

createScreen();
