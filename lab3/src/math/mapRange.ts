export default function mapRange(
  value: number,
  fromA: number,
  fromB: number,
  toA: number,
  toB: number,
): number {
  return toA + (value - fromA) * ((toB - toA) / (fromB - fromA));
}
