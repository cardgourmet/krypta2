import {ActionIcon, Button, Group, Modal, Stack, Tooltip} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconTrash, IconTrashOff} from '@tabler/icons-react';
import {useRouter} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {deleteLists} from '@/parcels/lists/api.ts';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from './DeleteListButton.module.css';

export function DeleteListButton({ list }: { list: UserList }) {
  const [opened, { open, close }] = useDisclosure(false);
  const auth = useAuth();
  const router = useRouter();

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
          <GourmetText>
            This will delete the list <code>{list.name}</code> permanently.
          </GourmetText>

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
              <GourmetText cgmc={'neutral-9'}>Cancel</GourmetText>
            </Button>
            <Button
              color={'var(--gourmet-red-01)'}
              onClick={() => {
                if (!auth.user) return;

                deleteLists(auth.user.id, [list.id]).then(({ error }) => {
                  if (error) {
                    console.log('error when deleting list :(', error);
                    return;
                  }

                  console.log('success!');

                  // cleanup and close
                  close();
                  router.invalidate();
                });
              }}
            >
              <GourmetText cgmc={'neutral-0'}>Confirm delete</GourmetText>
            </Button>
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
