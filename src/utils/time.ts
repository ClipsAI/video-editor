const ONE_MINUTE: number = 60;
const ONE_HOUR: number = 3600;

export function convertToDuration(seconds: number): string {
  let hours: number = Math.floor(seconds / ONE_HOUR);
  let minutes: number = Math.floor((seconds - (hours * ONE_HOUR)) / ONE_MINUTE);
  let secondsLeft: number = seconds - (hours * ONE_HOUR) - (minutes * ONE_MINUTE);
  if (!!hours) {
    if (!!minutes) {
      return `${hours}h ${minutes}m ${secondsLeft}s`
    } else {
      return `${hours}h ${secondsLeft}s`
    }
  }
  if (!!minutes) {
    return `${minutes}m ${secondsLeft}s`
  }
  return `${secondsLeft}s`
}

export function convertToTime(
    seconds: number,
    showMilliSeconds: boolean = false
): string {
  const milliseconds: number = seconds * 1000;

  const startChar: number = seconds < ONE_HOUR ? 14 : 11;
  const endChar: number = showMilliSeconds ? 22 : 19;

  return new Date(milliseconds).toISOString().slice(startChar, endChar);
}

export function computeDuration(start: number, end: number): number {
  return end - start;
}