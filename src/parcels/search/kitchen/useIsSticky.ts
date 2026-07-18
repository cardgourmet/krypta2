import { type RefObject, useEffect, useState } from 'react';

type UseIsStickyOptions = {
  root?: Element | Document | null;
};

export function useIsSticky(sentinelRef: RefObject<HTMLElement | null>, options: UseIsStickyOptions = {}) {
  const { root = null } = options;
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        root,
        threshold: 0,
        rootMargin: `0px 0px 0px 0px`,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [sentinelRef, root]);

  return isSticky;
}
