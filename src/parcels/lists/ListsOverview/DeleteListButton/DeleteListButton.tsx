import {ActionIcon, Button, Group, Modal, Stack, Tooltip} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconTrash, IconTrashOff} from '@tabler/icons-react';
import styles from '@/parcels/lists/ListsOverview/ListElementHeader/ListElementHeader.module.css';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export function DeleteListButton({ list }: { list: UserList }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconTrash size={20} color={'var(--gourmet-neutral-9)'} />
            <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
              Are you sure?
            </GourmetText>
          </Group>
        }
      >
        <Stack>
          <GourmetText>This will delete the list {list.name} permanently.</GourmetText>

          <Group justify={'end'}>
            <Button>Cancel</Button>
            <Button>Confirm delete</Button>
          </Group>
        </Stack>
      </Modal>

      <Tooltip
        label={list.systemListType ? `This is a system list and can't be deleted` : 'Delete List'}
        openDelay={500}
      >
        <ActionIcon className={styles.editButton} disabled={list.systemListType !== undefined} onClick={open}>
          {list.systemListType && <IconTrashOff color={'var(--gourmet-neutral-5'} size={20} />}
          {!list.systemListType && <IconTrash color={'var(--gourmet-neutral-7'} size={20} />}
        </ActionIcon>
      </Tooltip>
    </>
  );
}
