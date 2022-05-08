import isNumber from './isNumber';

export default function splitTimestamp(tm: string) {
  let timestamp: string | number = Date.parse(tm);
  if (!isNumber(timestamp)) timestamp = new Date().toJSON();

  timestamp = new Date(timestamp).toJSON();

  const datetime = timestamp.split('T');
  const date = datetime[0];
  const timeFull = datetime[1];

  const hhmmss = timeFull.split('.')[0];
  const _partials = hhmmss.split(':');

  const hours = _partials[0];
  const minutes = _partials[1];
  const seconds = _partials[2];

  const hhmm = `${hours}:${minutes}`;

  return { date, timeFull, hhmmss, hhmm, hours, minutes, seconds };
}
