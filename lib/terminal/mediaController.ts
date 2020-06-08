import blessed, { Widgets } from 'blessed';
import { executeInRenderer } from './utils';
import { getMediaSrc } from './index';

export default function mediaController(screen: Widgets.Screen): Widgets.BoxElement {
  const mediaForm = blessed.box({
    label: 'Media Controls',
    parent: screen,
    border: {
      type: 'line',
    },
    focusable: true,
    mouse: true,
    top: '40%',
    left: '+80%',
    width: '20%',
    height: '15%',
  });

  const playButton = blessed.button({
    parent: mediaForm,
    mouse: true,
    shrink: true,
    focusable: false,
    padding: {
      left: 1,
      right: 1,
    },
    left: 13,
    top: 1,
    content: 'Play ▶',
    style: {
      bg: 'blue',
      hover: {
        bg: 'red',
      },
    },
  });

  const pauseButton = blessed.button({
    parent: mediaForm,
    mouse: true,
    shrink: true,
    focusable: false,
    padding: {
      left: 1,
      right: 1,
    },
    left: '5%',
    top: 1,
    content: 'Pause ||',
    style: {
      bg: 'blue',
      hover: {
        bg: 'red',
      },
    },
  });

  const stopButton = blessed.button({
    parent: mediaForm,
    mouse: true,
    shrink: true,
    focusable: false,
    padding: {
      left: 1,
      right: 1,
    },
    left: '65%',
    top: 1,
    content: 'Stop ■',
    style: {
      bg: 'blue',
      hover: {
        bg: 'red',
      },
    },
  });

  const loopButton = blessed.checkbox({
    parent: mediaForm,
    mouse: true,
    shrink: true,
    focusable: false,
    padding: {
      left: 1,
      right: 1,
    },
    left: '55%',
    top: 3,
    content: 'Loop',
    style: {
      bg: 'blue',
      hover: {
        bg: 'red',
      },
    },
  });

  const muteButton = blessed.checkbox({
    parent: mediaForm,
    mouse: true,
    shrink: true,
    focusable: false,
    padding: {
      left: 1,
      right: 1,
    },
    left: '20%',
    top: 3,
    content: 'Mute',
    style: {
      bg: 'blue',
      hover: {
        bg: 'red',
      },
    },
  });

  playButton.on('press', async () => {
    const src = getMediaSrc();
    if (src) {
      await executeInRenderer('playAudio', src);
    }
  });
  pauseButton.on('press', async () => {
    await executeInRenderer('pauseAudio');
  });
  stopButton.on('press', async () => {
    await executeInRenderer('stopAudio');
  });
  muteButton.on('check', async () => {
    await executeInRenderer('muteAudio');
  });
  muteButton.on('uncheck', async () => {
    await executeInRenderer('unmuteAudio');
  });
  loopButton.on('check', async () => {
    await executeInRenderer('enableLoopAudio');
  });
  loopButton.on('uncheck', async () => {
    await executeInRenderer('disableLoopAudio');
  });

  const nodes = [
    playButton,
    pauseButton,
    stopButton,
    muteButton,
    loopButton,
  ];

  nodes.forEach((node) => {
    mediaForm.append(node);
    node.enableMouse();
  });

  return mediaForm;
}
