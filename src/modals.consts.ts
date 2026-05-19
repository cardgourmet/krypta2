import { CreateListModal } from './parcels/lists/modals/CreateListModal/CreateListModal';
import type { ModalRegistry } from './parcels/modals/types';

export const modalRegistry = {
  createList: {
    component: CreateListModal,
  },
} as const satisfies ModalRegistry;
