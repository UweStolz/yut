import { getWindow } from '../../electron/main';

export default async function executeInRenderer(functionName: string, src?: string): Promise<void> {
  const functionToExecute = src
    ? `${functionName}('${src}');`
    : `${functionName}();`;
  const win = getWindow();
  if (win) {
    await win.webContents.executeJavaScript(functionToExecute, true);
  }
}
