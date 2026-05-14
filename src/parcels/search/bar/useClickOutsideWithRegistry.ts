import { useCallback, useEffect, useRef } from 'react';

type MaybeElement = HTMLElement | null;

export function useClickOutsideWithRegistry(onOutside: () => void, enabled = true) {
  // I've tried it without having this intermediary object here, but it wouldn't work with
  // normal state.
  // I've also tried everything getting it to work with Mantine's `useClickOutside` to no success.
  const elementsRef = useRef<Set<HTMLElement>>(new Set());

  const register = useCallback((el: MaybeElement) => {
    if (!el) return;
    elementsRef.current.add(el);
  }, []);

  const unregister = useCallback((el: MaybeElement) => {
    if (!el) return;
    elementsRef.current.delete(el);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: MouseEvent | PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      for (const el of elementsRef.current) {
        if (el.contains(target)) return;
      }

      onOutside();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [enabled, onOutside]);

  return useCallback(
    (el: HTMLElement | null) => {
      if (el) register(el);
      else unregister(el);
    },
    [register, unregister],
  );
}
