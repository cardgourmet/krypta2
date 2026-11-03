import { ActionIcon, Tooltip } from '@mantine/core';
import { IconTrash, IconTrashOff } from '@tabler/icons-react';
import { use } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import type { UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { ModalContext } from '@/parcels/modals/Modal.context.tsx';
import styles from './DeleteListButton.module.css';

export function DeleteListButton({ list }: { list: UserListWithResources }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.delete' });

  const { requestModal } = use(ModalContext);
  const { removeLists } = useActiveLists();

  return (
    <Tooltip label={list.list.systemListType ? t('system') : t('tooltip')} openDelay={500}>
      <ActionIcon
        className={styles.editButton}
        disabled={list.list.systemListType !== undefined}
        onClick={async () => {
          try {
            const deletedList = await requestModal<UserList>('deleteList', {
              async: true,
              innerProps: { list: list },
            });

            if (deletedList) {
              removeLists([deletedList.id]);
            }
          } catch {}
        }}
      >
        {list.list.systemListType && <IconTrashOff color={'var(--gourmet-neutral-5'} size={20} />}
        {!list.list.systemListType && <IconTrash color={'var(--gourmet-neutral-7'} size={20} />}
      </ActionIcon>
    </Tooltip>
  );
}
