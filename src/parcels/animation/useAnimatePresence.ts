import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { type RefObject, use, useRef } from 'react';
import { PresenceContext } from './Presence';

// GSAP-Hook global registrieren, damit React-Version-Mismatches vermieden werden
gsap.registerPlugin(useGSAP);

type AnimationFactory = (element: HTMLElement) => GSAPAnimation;
type GSAPAnimation = gsap.core.Tween | gsap.core.Timeline;

export type PresenceAnimations = {
  onEnter?: AnimationFactory;
  onExit?: AnimationFactory;
};

export function useAnimatePresence<T extends HTMLElement = HTMLElement>({
  onEnter,
  onExit,
}: PresenceAnimations = {}): RefObject<T | null> {
  const context = use(PresenceContext);
  if (!context) {
    throw new Error('useAnimatePresence muss innerhalb von <Presence> verwendet werden.');
  }
  const { onExitComplete, status } = context;
  const ref = useRef<T>(null);

  const { contextSafe } = useGSAP({ scope: ref });

  useGSAP(() => {
    if (status !== 'entering' || !ref.current || !onEnter) return;
    onEnter(ref.current);
  }, []);

  useGSAP(() => {
    if (status !== 'exiting' || !ref.current) return;

    if (!onExit) {
      onExitComplete();
      return;
    }

    // contextSafe() sorgt dafür, dass das Tween im GSAP-Context landet,
    // obwohl es durch eine React-State-Änderung (nicht beim Mount) entsteht.
    const safeOnExit = contextSafe((el: HTMLElement) => {
      const tween = onExit(el);

      if (!tween) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[useAnimatePresence] onExit muss ein GSAP-Tween oder eine Timeline zurückgeben.');
        }
        onExitComplete();
        return;
      }

      tween.eventCallback('onComplete', onExitComplete);
    });

    safeOnExit(ref.current);
  }, [status]);
  // `onExit` und `onExitComplete` sind bewusst nicht in Deps:
  // Sie sollen stabil sein (außerhalb des Renders definieren oder useCallback).

  return ref;
}
