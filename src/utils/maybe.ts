/**
 * Can be used to conditionally add an item to an array.
 * @example
 * const cond = true;
 *
 * const arr = [
 *   1,
 *   2,
 *   ...maybe(3, cond),
 * ];
 */
export function maybe<V>(value: V, when: boolean, never?: never): V[];
/**
 * Can be used to conditionally add a key-value pair to an object.
 * @example
 * const cond = true;
 *
 * const obj = {
 *   staticValue: true,
 *   ...maybe('dynamicValue', 128, cond),
 * };
 */
export function maybe<K extends PropertyKey, V>(key: K, value: V, when?: boolean): Record<K, V>;
export function maybe<V, K extends PropertyKey>(
  keyOrValue: K | V,
  valueOrWhen: V | boolean,
  whenOrNever?: boolean | never,
) {
  if (typeof whenOrNever === 'undefined') {
    // Array
    if (!valueOrWhen) return [];

    return [keyOrValue];
  }

  if (!whenOrNever) return {};

  return { [keyOrValue as K]: valueOrWhen };
}

/**
 * Can be used to conditionally add an item to an array.
 * @remarks This version of maybe does not have a seperate "condition" parameter, the value will be added when it's truthy. Use {@link maybe} if the value might be a boolean.
 */
export function smartMaybe<V, _ extends V extends boolean ? never : unknown = V extends boolean ? never : unknown>(
  value: V | false,
  never?: never,
): V[];
/**
 * Can be used to conditionally add a key-value pair to an object.
 * @remarks This version of maybe does not have a seperate "condition" parameter, the value will be added when it's truthy. Use {@link maybe} if the value might be a boolean.
 */
export function smartMaybe<
  K extends PropertyKey,
  V,
  _ extends V extends boolean ? never : unknown = V extends boolean ? never : unknown,
>(key: K, value: V | false): Record<K, V>;
export function smartMaybe<K extends PropertyKey, V>(keyOrValue: K | V | false, valueOrNever?: V | false | never) {
  if (typeof valueOrNever === 'undefined') {
    // Array
    if (keyOrValue === false) return [];

    return [keyOrValue];
  }

  if (valueOrNever === false) return {};

  return { [keyOrValue as K]: valueOrNever };
}
