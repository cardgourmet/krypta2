/**
 * Accepts a generic value to pass into a chain of functions.
 * @param to The initial value passed to the first function.
 * @param fns The functions to apply consecutively. Every output is the input for the next function.
 * @returns The output of the final function.
 */
export function apply<T>(to: T, ...fns: (((it: T) => T) | undefined)[]) {
  return fns.filter(Boolean).reduce((it, fn) => fn!(it), to);
}
