import { CreateListModal } from './parcels/lists/modals/CreateListModal/CreateListModal';
import { EditListModal } from './parcels/lists/modals/EditListModal/EditListModal';
import type { ModalRegistry } from './parcels/modals/types';

export const modalRegistry = {
  createList: {
    component: CreateListModal,
  },
  editList: {
    component: EditListModal,
  },
} as const satisfies ModalRegistry;
