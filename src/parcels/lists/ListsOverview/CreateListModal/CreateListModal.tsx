import {Button, Group, Modal} from '@mantine/core';
import type {UseDisclosureReturnValue} from '@mantine/hooks';
import {IconList} from '@tabler/icons-react';
import {useRouter} from '@tanstack/react-router';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {createList} from '@/parcels/lists/api.ts';
import {ListValuesForm} from '@/parcels/lists/ListsOverview/ListValuesForm/ListValuesForm.tsx';
import {useListForm} from '@/parcels/lists/ListsOverview/useListForm.ts';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export function CreateListModal(props: { disclosure: UseDisclosureReturnValue; onSuccess?: () => void }) {
  const [opened, { close }] = props.disclosure;
  const auth = useAuth();

  const form = useListForm();
  const router = useRouter();

  return (
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

          createList(auth.user.id, list).then(({ data, error }) => {
            if (error) {
              console.log('error when creating list :(', error);
              return;
            }

            console.log('success!', data);
            // cleanup and close
            close();
            form.reset();
            router.invalidate();

            if (props.onSuccess) {
              props.onSuccess();
            }
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
  );
}
