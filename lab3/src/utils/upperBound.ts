export default function upperBound<T>(
  array: ReadonlyArray<T>,
  isBefore: (a: T) => boolean,
): number {
  let count = array.length;

  let first = 0;

  while (count > 0) {
    const step = Math.floor(count / 2);
    const it = first + step;
    if (!isBefore(array[it])) {
      first = it + 1;
      count -= step + 1;
    } else {
      count = step;
    }
  }

  return first;
}
