import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { use } from 'react';
import type { UserList } from '@/parcels/lists/types.ts';
import { ModalContext } from '@/parcels/modals/Modal.context';
import styles from './EditListButton.module.css';

export function EditListButton({ list, onSuccess }: { list: UserList; onSuccess?: (list: UserList) => void }) {
  const { requestModal } = use(ModalContext);

  return (
    <Tooltip label={'Edit list'} openDelay={500}>
      <ActionIcon
        className={styles.editButton}
        onClick={async () => {
          try {
            const updatedList = await requestModal<UserList>('editList', { async: true, innerProps: { list } });

            if (updatedList && onSuccess) {
              onSuccess(updatedList);
            }
          } catch {}
        }}
      >
        <IconPencil color={'var(--gourmet-neutral-7'} size={20} />
      </ActionIcon>
    </Tooltip>
  );
}
