export default function isNumber(n: number | string): boolean {
  return ((n != null) && (n !== '') && !isNaN(Number(n.toString())));
}
