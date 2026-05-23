import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPencil, IconPencilOff } from '@tabler/icons-react';
import { use } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserList } from '@/parcels/lists/types.ts';
import { ModalContext } from '@/parcels/modals/Modal.context';
import styles from './EditListButton.module.css';

export function EditListButton({ list, onSuccess }: { list: UserList; onSuccess?: (list: UserList) => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.edit' });

  const { requestModal } = use(ModalContext);

  return (
    <Tooltip label={list.systemListType ? t('system') : t('title')} openDelay={500}>
      <ActionIcon
        className={styles.editButton}
        disabled={list.systemListType !== undefined}
        onClick={async () => {
          try {
            const updatedList = await requestModal<UserList>('editList', { async: true, innerProps: { list } });

            if (updatedList && onSuccess) {
              onSuccess(updatedList);
            }
          } catch {}
        }}
      >
        {list.systemListType && <IconPencilOff color={'var(--gourmet-neutral-5'} size={20} />}
        {!list.systemListType && <IconPencil color={'var(--gourmet-neutral-7'} size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
