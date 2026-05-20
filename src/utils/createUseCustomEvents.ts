// Based on https://github.com/mantinedev/mantine/blob/644f6c4001a408ae6b51e6f87f6e852329f94b40/packages/%40mantine/core/src/core/utils/create-use-external-events/create-use-external-events.ts

import { useIsomorphicEffect } from './useIsomorphicEffect';

function dispatchEvent<T>(type: string, detail?: T) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

export function createUseCustomEvents<
  // biome-ignore lint/suspicious/noExplicitAny: this is valid
  T extends Record<string, (detail: any) => void>,
>(prefix: string) {
  function useCustomEvents(events: T) {
    const handlers: Record<string, EventListener> = Object.keys(events).reduce(
      (handlers, eventKey) => ({
        // biome-ignore lint/performance/noAccumulatingSpread: hmm, I should come back to this // TODO
        ...handlers,
        [`svk:${prefix}:${eventKey}`]: (event: CustomEvent) => events[eventKey]!(event.detail),
      }),
      {},
    );

    useIsomorphicEffect(() => {
      Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]!);
        window.addEventListener(eventKey, handlers[eventKey]!);
      });

      return () =>
        Object.keys(handlers).forEach((eventKey) => {
          window.removeEventListener(eventKey, handlers[eventKey]!);
        });
    }, [handlers]);
  }

  function createEvent<K extends keyof T>(event: K) {
    type P = Parameters<T[K]>[0];

    return (...payload: P extends undefined ? [undefined?] : [P]) =>
      dispatchEvent(`svk:${prefix}:${String(event)}`, payload[0]);
  }

  return [useCustomEvents, createEvent] as const;
}
