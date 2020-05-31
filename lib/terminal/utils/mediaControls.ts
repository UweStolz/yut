import { getWindow } from '../../electron/main';

async function executeInRenderer(functionName: string, src?: string): Promise<void> {
  const functionToExecute = src
    ? `${functionName}('${src}');`
    : `${functionName}();`;
  const win = getWindow();
  if (win) {
    await win.webContents.executeJavaScript(functionToExecute, true);
  }
}
export default {
  async playMedia(src: string): Promise<void> {
    await executeInRenderer('playAudio', src);
  },

  async pauseMedia(): Promise<void> {
    await executeInRenderer('pauseAudio');
  },

  async stopMedia(): Promise<void> {
    await executeInRenderer('stopAudio');
  },

  async muteMedia(): Promise<void> {
    await executeInRenderer('muteAudio');
  },
};
