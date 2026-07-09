import { useGSAP } from '@gsap/react';
import { type RefObject, useRef } from 'react';
import type { PresenceAnimations } from './useAnimatePresence';

export function useAnimateVisibility<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  visible: boolean,
  { onEnter, onExit }: PresenceAnimations,
) {
  const { contextSafe } = useGSAP({ scope: ref });

  const previousVisible = useRef(false);

  useGSAP(() => {
    const didBecomeVisible = visible && previousVisible.current === false;
    const didBecomeHidden = !visible && previousVisible.current === true;
    previousVisible.current = visible;

    //console.log({ el: ref.current, didBecomeHidden, didBecomeVisible, visible });

    if (didBecomeVisible && onEnter && ref.current) {
      console.log('became visible');
      onEnter(ref.current);
    }

    if (didBecomeHidden && onExit && ref.current) {
      const safeExit = contextSafe((el: HTMLElement) => onExit(el));
      safeExit(ref.current);
    }
  }, [visible]);
}
