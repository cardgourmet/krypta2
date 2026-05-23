import type { ReactElement, ReactNode } from 'react';

export type PresenceContextValue = {
  status: PresenceStatus;
  onExitComplete: () => void;
};

export type PresenceItem = {
  element: ReactElement;
  status: PresenceStatus;
};

export type PresenceProps = { children: ReactNode };

export type PresenceStatus = 'entering' | 'present' | 'exiting';
