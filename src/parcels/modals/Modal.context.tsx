import { createContext } from 'react';
import { Presence } from '../animation/Presence';
import { useModalsEvents } from './modals.events';
import type { ModalContextProviderProps, ModalContextValue } from './types';
import { useModalQueue } from './useModalQueue';

export const ModalContext = createContext<ModalContextValue>({
  closeModal: undefined!,
  requestModal: undefined!,
});

export const ModalContextProvider = ({ children, modals }: ModalContextProviderProps) => {
  const { closeModal, queue, requestModal } = useModalQueue(modals);

  useModalsEvents({
    closeModal,
    requestModal: ({ name, data }) => requestModal(name, data),
  });

  return (
    <ModalContext
      value={{
        closeModal,
        requestModal,
      }}
    >
      {children}

      <Presence>
        {queue
          .filter((modal) => modal.active)
          .map(({ Component, ...modal }) => (
            <Component
              active
              innerProps={modal.innerProps}
              key={modal.id}
              modalId={modal.id}
              modalName={modal.name}
              noOverlay={modal.interrupting}
              onClose={() => closeModal(modal.id)}
              onReject={modal.reject}
              onResolve={modal.resolve}
              visible={modal.visible}
            />
          ))}
      </Presence>
    </ModalContext>
  );
};
