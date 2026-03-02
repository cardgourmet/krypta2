import {Button, Group, Modal} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconList, IconPlus} from '@tabler/icons-react';
import {useRouter} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {createList} from '@/parcels/lists/api.ts';
import {ListValuesForm} from '@/parcels/lists/ListsOverview/ListValuesForm/ListValuesForm.tsx';
import {useListForm} from '@/parcels/lists/ListsOverview/useListForm.ts';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export default function CreateListButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const auth = useAuth();

  const form = useListForm();
  const router = useRouter();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconList size={20} color={'var(--gourmet-neutral-9)'} />
            <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
              Create New List
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
            const list = {
              name: formValues.name,
              description: formValues.description,
              visibility: formValues.visibility,
              allowedTcgs: formValues.allowedTcgs,
              color: formValues.color,
            } as Partial<UserList> & { name: string };

            createList(auth.user.id, list, auth.token).then(({ data, error }) => {
              if (error) {
                console.log('error when creating list :(', error);
                return;
              }

              console.log('success!', data);
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
              <GourmetText cgmc={'neutral-1'}>Create</GourmetText>
            </Button>
          </Group>
        </form>
      </Modal>

      <Button
        color={'var(--gourmet-blue-1)'}
        leftSection={<IconPlus size={20} color={'var(--gourmet-neutral-1'} />}
        h={'1.75rem'}
        p={'0 0.5rem'}
        onClick={open}
      >
        <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'} fw={500}>
          Create new list
        </GourmetText>
      </Button>
    </>
  );
}
