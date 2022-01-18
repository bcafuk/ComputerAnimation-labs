export default function requireNonNull<T>(
  object: T | null,
  error = 'The object must not be null.',
): T {
  if (object === null) throw new TypeError(error);
  return object;
}
