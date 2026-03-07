import {ActionIcon, Button, Group, Modal, Tooltip} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconPencil, IconPencilOff} from '@tabler/icons-react';
import {useRouter} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {updateList} from '@/parcels/lists/api.ts';
import {ListValuesForm} from '@/parcels/lists/ListsOverview/ListValuesForm/ListValuesForm.tsx';
import {useListForm} from '@/parcels/lists/ListsOverview/useListForm.ts';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from './EditListButton.module.css';

export function EditListButton({ list }: { list: UserList }) {
  const [opened, { open, close }] = useDisclosure(false);
  const auth = useAuth();

  const form = useListForm({ list: list });
  const router = useRouter();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconPencil size={20} color={'var(--gourmet-neutral-9)'} />
            <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
              Edit List
            </GourmetText>
          </Group>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!auth.user) return;

            const res = form.validate();
            if (res.hasErrors) return;

            const formValues = form.getValues();
            const newList = {
              id: list.id,
              name: formValues.name,
              description: formValues.description,
              visibility: formValues.visibility,
              allowedTcgs: formValues.allowedTcgs,
              color: formValues.color,
            } as Partial<UserList> & { name: string };

            updateList(auth.user.id, newList, auth.token).then(({ error }) => {
              if (error) {
                console.log('error when updating list :(', error);
                return;
              }

              console.log('success!');
              // cleanup and close
              close();
              form.reset();
              router.invalidate();
            });
          }}
        >
          <ListValuesForm form={form} />

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
              <GourmetText cgmc={'neutral-9'}>Cancel</GourmetText>
            </Button>
            <Button type="submit" color={'var(--gourmet-blue-1)'}>
              <GourmetText cgmc={'neutral-1'}>Update</GourmetText>
            </Button>
          </Group>
        </form>
      </Modal>

      <Tooltip label={list.systemListType ? `This is a system list and can't be edited` : 'Edit List'} openDelay={500}>
        <ActionIcon className={styles.editButton} disabled={list.systemListType !== undefined} onClick={open}>
          {list.systemListType && <IconPencilOff color={'var(--gourmet-neutral-5'} size={20} />}
          {!list.systemListType && <IconPencil color={'var(--gourmet-neutral-7'} size={20} />}
        </ActionIcon>
      </Tooltip>
    </>
  );
}
