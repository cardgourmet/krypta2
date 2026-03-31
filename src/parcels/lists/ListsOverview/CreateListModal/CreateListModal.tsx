import {Button, Group, Modal} from '@mantine/core';
import type {UseDisclosureReturnValue} from '@mantine/hooks';
import {IconList} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {createList} from '@/parcels/lists/api.ts';
import {ListValuesForm} from '@/parcels/lists/ListsOverview/ListValuesForm/ListValuesForm.tsx';
import {useListForm} from '@/parcels/lists/ListsOverview/useListForm.ts';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {useGourmetNotification} from '@/parcels/notification/useGourmetNotification.ts';

export function CreateListModal(props: { disclosure: UseDisclosureReturnValue; onSuccess?: (list: UserList) => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'create' });
  const [opened, { close }] = props.disclosure;
  const auth = useAuth();

  const form = useListForm();
  const noti = useGourmetNotification();

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Group gap={'0.5rem'}>
          <IconList size={20} color={'var(--gourmet-neutral-9)'} />
          <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
            {t('title')}
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
              console.error('Error creating list', error.message);
              noti.show('Unknown error', `${error.message}`, 'error');
              return;
            }

            noti.show('List Created', `\`${data?.name}\` has been created`, 'success');

            // cleanup and close
            close();
            form.reset();

            if (props.onSuccess) {
              props.onSuccess(data as UserList);
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
