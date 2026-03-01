import {ActionIcon, Tooltip} from '@mantine/core';
import {IconEdit} from '@tabler/icons-react';
import styles from '@/parcels/lists/ListsOverview/ListElementHeader/ListElementHeader.module.css';

export function EditListButton() {
  return (
    <Tooltip label={'Edit List'} openDelay={500}>
      <ActionIcon className={styles.editButton}>
        <IconEdit color={'var(--gourmet-neutral-7'} size={20} />
      </ActionIcon>
    </Tooltip>
  );
}
