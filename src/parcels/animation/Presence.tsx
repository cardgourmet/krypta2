import { Children, createContext, type ReactElement, type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import type { PresenceContextValue, PresenceItem, PresenceProps } from './types';

/** Wandelt React-Children in eine geordnete Map um. */
function childrenToMap(children: ReactNode): Map<string, PresenceItem> {
  return new Map(
    (Children.toArray(children) as ReactElement[]).map((child) => [
      child.key as string,
      { element: child, status: 'present' },
    ]),
  );
}

/** Extrahiert alle Keys aus React-Children. */
function getChildKeys(children: ReactNode): string[] {
  return (Children.toArray(children) as ReactElement[]).map((c) => c.key as string);
}

export const PresenceContext = createContext<PresenceContextValue | null>(null);

export const Presence = ({ children }: PresenceProps) => {
  const [items, setItems] = useState<Map<string, PresenceItem>>(() => childrenToMap(children));

  // Ref hält immer die aktuellste items-Map für Closures in Callbacks
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // useLayoutEffect: Diff läuft synchron vor dem Paint,
  // damit kein "Flash of removed content" entsteht
  useLayoutEffect(() => {
    const currentKeys = getChildKeys(children);
    const prevKeys = [...itemsRef.current.keys()];

    // 1. Entfernte Keys → Status "exiting"
    const removedKeys = prevKeys.filter((k) => !currentKeys.includes(k));
    if (removedKeys.length > 0) {
      setItems((prev) => {
        const next = new Map(prev);
        for (const key of removedKeys) {
          const item = next.get(key);
          if (item && item.status !== 'exiting') {
            next.set(key, { ...item, status: 'exiting' });
          }
        }
        return next;
      });
    }

    // 2. Neue Keys → hinzufügen mit Status "entering"
    for (const child of Children.toArray(children) as ReactElement[]) {
      if (!prevKeys.includes(child.key as string)) {
        setItems((prev) => {
          const next = new Map(prev);
          next.set(child.key as string, { element: child, status: 'entering' });
          return next;
        });
      }
    }

    // 3. Vorhandene Keys → Element-Referenz aktuell halten (Props-Updates)
    for (const child of Children.toArray(children) as ReactElement[]) {
      const key = child.key as string;
      if (prevKeys.includes(key)) {
        setItems((prev) => {
          const item = prev.get(key);
          if (!item || item.element === child) return prev;
          const next = new Map(prev);
          next.set(key, { ...item, element: child });
          return next;
        });
      }
    }
  }, [children]);

  /**
   * Wird vom `useGsapPresence`-Hook am Ende der Exit-Animation aufgerufen.
   * Entfernt das Element endgültig aus der Map.
   */
  const handleExitComplete = (key: string): void => {
    setItems((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  return (
    <>
      {[...items.entries()].map(([key, { element, status }]) => (
        <PresenceContext
          key={key}
          value={{
            status,
            onExitComplete: () => handleExitComplete(key),
          }}
        >
          {element}
        </PresenceContext>
      ))}
    </>
  );
};
