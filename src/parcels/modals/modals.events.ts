import { createUseCustomEvents } from '@/utils/createUseCustomEvents';
import type { ModalRequest } from './types';

type ModalsEvents = {
  closeModal: (id: number) => void;
  requestModal: (payload: { name: string; data?: ModalRequest }) => void;
};

export const [useModalsEvents, createModalsEvent] = createUseCustomEvents<ModalsEvents>('modals');

export const modals = {
  close: (id: number) => {
    createModalsEvent('closeModal')(id);
  },
  request: (name: string, data?: ModalRequest) => {
    createModalsEvent('requestModal')({ name, data });
  },
};
