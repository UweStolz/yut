import blessed, { Widgets } from 'blessed';
import { mediaControls } from './utils';
import { getMediaSrc } from './index';

export default function form(screen: Widgets.Screen): Widgets.FormElement<unknown> {
  const mediaForm = blessed.form({
    label: 'Media Controls',
    parent: screen,
    border: {
      type: 'line',
    },
    focusable: true,
    keys: true,
    mouse: true,
    top: '40%',
    left: '+80%',
    width: '20%',
    height: '15%',
  });

  const playButton = blessed.button({
    parent: mediaForm,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1,
    },
    left: 13,
    top: 1,
    name: 'Play',
    content: 'Play ▶',
    style: {
      bg: 'blue',
      focus: {
        bg: 'red',
      },
      hover: {
        bg: 'red',
      },
    },
  });

  const pauseButton = blessed.button({
    parent: mediaForm,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1,
    },
    left: '20%',
    top: 3,
    name: 'Pause',
    content: 'Pause ||',
    style: {
      bg: 'blue',
      focus: {
        bg: 'red',
      },
      hover: {
        bg: 'red',
      },
    },
  });

  const stopButton = blessed.button({
    parent: mediaForm,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
      left: 1,
      right: 1,
    },
    left: '55%',
    top: 3,
    name: 'Stop',
    content: 'Stop ■',
    style: {
      bg: 'blue',
      focus: {
        bg: 'red',
      },
      hover: {
        bg: 'red',
      },
    },
  });

  playButton.on('press', async () => {
    const src = getMediaSrc();
    if (src) {
      await mediaControls.playMedia(src);
    }
  });

  pauseButton.on('press', async () => {
    await mediaControls.pauseMedia();
  });

  stopButton.on('press', async () => {
    await mediaControls.stopMedia();
  });

  const nodes = [playButton, pauseButton, stopButton];

  nodes.forEach((node) => {
    mediaForm.append(node);
    node.enableMouse();
    node.enableKeys();
  });

  return mediaForm;
}
