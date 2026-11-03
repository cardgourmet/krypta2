import { IconPlus } from '@tabler/icons-react';
import { use } from 'react';
import type { UserList } from '@/parcels/lists/types.ts';
import { ModalContext } from '@/parcels/modals/Modal.context.tsx';
import styles from './GridEntryCreateList.module.css';

export const GridEntryCreateList = ({ onSuccess }: { onSuccess: (list: UserList) => void }) => {
  const { requestModal } = use(ModalContext);

  return (
    <button
      className={styles.base}
      type="button"
      onClick={async () => {
        try {
          const list = await requestModal<UserList>('createList', { async: true });

          if (list && onSuccess) {
            onSuccess(list);
          }
        } catch {}
      }}
    >
      <div className={styles.plus}>
        <IconPlus size={64} color={'var(--gourmet-neutral-4)'} />
      </div>
    </button>
  );
};
