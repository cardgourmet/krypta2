import {ActionIcon, Button, Group, Modal, Tooltip} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconPencil, IconPencilOff} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {updateList} from '@/parcels/lists/api.ts';
import {ListValuesForm} from '@/parcels/lists/ListsOverview/ListValuesForm/ListValuesForm.tsx';
import {useListForm} from '@/parcels/lists/ListsOverview/useListForm.ts';
import type {UserList} from '@/parcels/lists/types.ts';
import {useGourmetNotification} from '@/parcels/notification/useGourmetNotification.ts';
import styles from './EditListButton.module.css';

export function EditListButton({ list, onSuccess }: { list: UserList; onSuccess?: (list: UserList) => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.edit' });
  const [opened, { open, close }] = useDisclosure(false);
  const auth = useAuth();

  const form = useListForm({ list: list });
  const noti = useGourmetNotification();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconPencil size={20} color={'var(--gourmet-neutral-9)'} />
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
            const newList = {
              ...list,
              id: list.id,
              name: formValues.name,
              description: formValues.description,
              visibility: formValues.visibility,
              allowedTcgs: formValues.allowedTcgs,
              color: formValues.color,
            } as Partial<UserList> & { name: string };

            updateList(auth.user.id, newList).then(({ error }) => {
              if (error) {
                noti.show('Unknown error', `${error}`, 'error');
                return;
              }

              noti.show('List Edited', `\`${list.name}\` has been edited`, 'success');

              // cleanup and close
              close();
              form.reset();
              if (onSuccess) onSuccess(newList as UserList);
            });
          }}
        >
          <ListValuesForm form={form} />

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
              <GourmetText cgmc={'neutral-9'}>{t('cancel')}</GourmetText>
            </Button>
            <Button type="submit" color={'var(--gourmet-blue-1)'}>
              <GourmetText cgmc={'neutral-1'}>{t('update')}</GourmetText>
            </Button>
          </Group>
        </form>
      </Modal>

      <Tooltip label={list.systemListType ? t('system') : t('title')} openDelay={500}>
        <ActionIcon className={styles.editButton} disabled={list.systemListType !== undefined} onClick={open}>
          {list.systemListType && <IconPencilOff color={'var(--gourmet-neutral-5'} size={20} />}
          {!list.systemListType && <IconPencil color={'var(--gourmet-neutral-7'} size={20} />}
        </ActionIcon>
      </Tooltip>
    </>
  );
}
