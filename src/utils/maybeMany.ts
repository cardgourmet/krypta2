/**
 * Can be used to conditionally spread an array or object to another.
 * @param value The array or object to spread.
 * @param when The condition in which {@link value} should be passed.
 */
export function maybeMany<V extends []>(value: V, when: boolean): V;
export function maybeMany<V extends object>(value: V, when: boolean): V;
export function maybeMany<V>(value: V, when: boolean) {
  if (when) return value;

  if (Array.isArray(value)) return [];

  return {};
}
