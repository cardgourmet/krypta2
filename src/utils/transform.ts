/**
 * Runs an inline transformation on the passed value if it's non-nullable.
 * @param it The value to transform.
 * @param func The transformation to apply.
 * @returns The original nullable-type (`null` or `undefined`) if {@link it} is nullable, otherwise the result of {@link func}.
 */
export function transform<T, R>(it: T, func: (it: NonNullable<T>) => R) {
  if (it !== null && it !== undefined) {
    return func(it);
  }

  return it as Exclude<T, NonNullable<T>>;
}
