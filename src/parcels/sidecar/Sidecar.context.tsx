import { createContext, type PropsWithChildren, useMemo, useState } from 'react';
import type { SidecarContextValue } from './types';

export const SidecarContext = createContext<SidecarContextValue>({
  isActive: false,
  isAvailable: false,
  setActive: () => void 0,
});

export const SidecarContextProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<Pick<SidecarContextValue, 'isActive' | 'isAvailable'>>({
    isActive: false,
    isAvailable: false,
  });
  const value = useMemo<SidecarContextValue>(
    () => ({
      ...state,
      setActive: (value) => setState((state) => ({ ...state, isActive: value })),
    }),
    [state],
  );

  return <SidecarContext value={value}>{children}</SidecarContext>;
};
