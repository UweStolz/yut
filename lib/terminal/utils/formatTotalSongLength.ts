export default function formatTotalSongLength(IsoTime: string): string {
  const reptms = /^(?:(\d+\.*\d*)H)?(?:(\d+\.*\d*)M)?(?:(\d+\.*\d*)S)?$/;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let totalLength = '';

  if (reptms.test(IsoTime)) {
    const matches = reptms.exec(IsoTime);
    if (matches) {
      if (matches[1]) {
        hours = Number(matches[1]);
        totalLength += `${hours}:`;
      }
      if (matches[2]) {
        minutes = Number(matches[2]);
        totalLength += `${minutes}:`;
      }
      if (matches[3]) {
        seconds = Number(matches[3]);
        if (seconds.toString(10).length === 1) {
          totalLength += `0${seconds}`;
        }
      } else {
        totalLength += '00';
      }
    }
  }
  return totalLength;
}
