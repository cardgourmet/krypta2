import { DeleteListModal } from '@/parcels/lists/modals/DeleteListModal/DeleteListModal.tsx';
import { EditListThumbnailModal } from '@/parcels/lists/modals/EditListThumbnailModal/EditListThumbnailModal.tsx';
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
  editListThumbnail: {
    component: EditListThumbnailModal,
  },
  deleteList: {
    component: DeleteListModal,
  },
} as const satisfies ModalRegistry;
