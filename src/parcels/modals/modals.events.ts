import { createUseCustomEvents } from '@/utils/createUseCustomEvents';
import type { ModalName, ModalRequest } from './types';

type ModalsEvents = {
  closeModal: (id: number) => void;
  requestModal: (payload: { name: ModalName; data?: ModalRequest }) => void;
};

export const [useModalsEvents, createModalsEvent] = createUseCustomEvents<ModalsEvents>('modals');

export const modals = {
  close: (id: number) => {
    createModalsEvent('closeModal')(id);
  },
  request: (name: ModalName, data?: ModalRequest) => {
    createModalsEvent('requestModal')({ name, data });
  },
};
