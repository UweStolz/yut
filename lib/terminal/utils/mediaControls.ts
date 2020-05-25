import { getWindow } from '../../electron/main';

async function executeInRenderer(id: string, mapping: any, functionName: string): Promise<void> {
  const src = mapping[id];
  const functionToExecute = `${functionName}('${src}');`;
  const win = getWindow();
  if (win) {
    await win.webContents.executeJavaScript(functionToExecute, true);
  }
}
export default {
  async playMedia(id: string, mapping: any): Promise<void> {
    await executeInRenderer(id, mapping, 'playAudio');
  },

  async pauseMedia(id: string, mapping: any): Promise<void> {
    await executeInRenderer(id, mapping, 'pauseAudio');
  },

  async stopMedia(id: string, mapping: any): Promise<void> {
    await executeInRenderer(id, mapping, 'stopAudio');
  },
};
