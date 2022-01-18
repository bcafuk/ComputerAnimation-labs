export default function maxAbs(a: number, b: number): number {
  if (Math.abs(a) >= Math.abs(b)) return a;
  return b;
}
