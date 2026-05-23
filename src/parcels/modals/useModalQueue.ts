'use client';

import { useState } from 'react';
import type { ModalMetadata, ModalQueueItem, ModalRequest } from './types';

/*
  Natürlich können wir immer nur ein Modal gleichzeitig anzeigen, deshalb
  muss eine Reihenfolge festgelegt werden, in der die Modale aus der Queue
  abgearbeitet werden. Dafür berechnen wir eine numerische Id, anhand derer
  die Queue aufsteigend sortiert und so einfacher geleert werden kann.

  Zwischen jedem Modal liegt ein Abstand von 1, 0 wird nicht vergeben.

  Modale mit hoher Priorität haben negative Ids, jedes einzelne bekommt dabei
  immer die nächstniedrigere zugewiesen und schiebt sich so immer in den
  Vordergrund. High Priority Modals sind also LIFO (last-in, first-out).

  Modale die verschachtelt geöffnet werden (also aus einem anderen Modal heraus)
  bekommen eine Id die um 0.1 niedriger ist, als die des Parent-Modals.
  Verschachtelte Modale werden also immer über ihrem Parent angezeigt, können und
  werden aber von High Priority Modals verdrängt.
  Da zwischen den Modalen nur 1 Abstand ist, können maximal 9 Modale ineinander
  verschachtelt werden, bevor die Ids kollidieren (wehe dem, der soweit geht).

  Reguläre Modale bekommen positive Ids, jedes einzelne bekommt dabei immer
  die nächsthöhere zugewiesen und wird entsprechend ans Ende der Queue eingereiht.
  Low Priority Modals sind also LILO (last-in, last-out).

  Wird ein Modal geschlossen werden auch alle niedrigeren Ids im selben Block geschlossen.
  Schließt man also bspw. das Modal 2 wird auch 1.9, 1.8 etc. (bis 1.1) geschlossen,
  sofern diese existiert haben. Schließt man 1.8, würden jedoch 1.9 und 2 weiter
  offen bleiben.
*/

function getNextItemState(
  queue: ModalQueueItem[],
  options: Pick<ModalRequest, 'highPriority' | 'nested'>,
): Pick<ModalQueueItem, 'active' | 'id' | 'interrupting' | 'visible'> {
  if (options.highPriority) {
    const lowest = Math.min(...queue.map((item) => item.id), 0);
    return {
      id: Math.ceil(lowest) - 1,
      active: true,
      interrupting: queue.length > 0,
      visible: true,
    };
  }

  if (options.nested) {
    const current = queue.find((item) => item.active && item.visible)!.id;
    return {
      id: current - 0.1,
      active: true,
      interrupting: true,
      visible: true,
    };
  }

  const highest = Math.max(...queue.map((item) => item.id), 0);
  return {
    id: highest + 1,
    active: queue.length === 0,
    interrupting: false,
    visible: queue.length === 0,
  };
}

export function useModalQueue(registry: Record<string, ModalMetadata>) {
  const [queue, setQueue] = useState<ModalQueueItem[]>([]);

  const closeModal = (id: number) => {
    const remaining = queue.filter((item) => item.id <= Math.ceil(id) - 1 || item.id > id);

    if (!remaining.length) {
      setQueue([]);
      return;
    }

    setQueue(
      remaining.map((item, i) => ({
        ...item,
        active: i === 0 ? true : item.active,
        visible: i === 0 ? true : item.visible,
      })),
    );
  };

  const requestModal = <T = unknown>(name: string, request: ModalRequest = {}) => {
    const metadata = registry[name];
    const component = request.component ?? metadata?.component;

    if (!component) {
      throw Error(`Modal "${name}" not found in registry and no explicit component was passed.`);
    }

    const item = {
      ...getNextItemState(queue, {
        highPriority: request.highPriority ?? metadata?.highPriority,
        nested: request.nested,
      }),
      Component: component,
      innerProps: request.innerProps,
      name,
    } satisfies ModalQueueItem;

    if (request.async) {
      return new Promise<T>((resolve, reject) =>
        setQueue((queue) =>
          [
            ...queue.map((i) => ({
              ...i,
              // Wir müssen im Zweifel alle anderen Modale unsichtbar aber nicht inaktiv stellen
              // So wird immer nur ein Modal angezeigt, die restlichen Modale aber nicht
              // unmounted, um zu verhindern, dass interner State in den Modalen verloren geht.
              visible: item.visible ? false : i.visible,
            })),
            {
              ...item,
              reject,
              resolve: resolve as (value: unknown) => void,
            },
          ].sort((a, b) => a.id - b.id),
        ),
      );
    }

    setQueue((queue) =>
      [
        ...queue.map((i) => ({
          ...i,
          visible: item.visible ? false : i.visible,
        })),
        item,
      ].sort((a, b) => a.id - b.id),
    );
  };

  return {
    closeModal,
    queue,
    requestModal,
  };
}
