import { ActionIcon, Button, Group, Modal, Stack, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconTrashOff } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { deleteLists } from '@/parcels/lists/api.ts';
import type { UserList } from '@/parcels/lists/types.ts';
import { useGourmetNotification } from '@/parcels/notification/useGourmetNotification.ts';
import styles from './DeleteListButton.module.css';

export function DeleteListButton({ list, onSuccess }: { list: UserList; onSuccess?: (id: string) => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.delete' });
  const [opened, { open, close }] = useDisclosure(false);
  const auth = useAuth();
  const noti = useGourmetNotification();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconTrash size={20} color={'var(--gourmet-neutral-9)'} />
            <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
              {t('youSure')}
            </GourmetText>
          </Group>
        }
      >
        <Stack>
          <GourmetText>{t('warning')}</GourmetText>

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
              <GourmetText cgmc={'neutral-9'}>{t('cancel')}</GourmetText>
            </Button>
            <Button
              color={'var(--gourmet-red-01)'}
              onClick={() => {
                if (!auth.user) return;

                deleteLists(auth.user.id, [list.id]).then(({ error }) => {
                  if (error) {
                    noti.show('Unknown error', `${error}`, 'error');
                    return;
                  }

                  noti.show('List Deleted', `\`${list.name}\` has been deleted`, 'success');

                  // cleanup and close
                  close();
                  if (onSuccess) onSuccess(list.id);
                });
              }}
            >
              <GourmetText cgmc={'neutral-0'}>{t('confirm')}</GourmetText>
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Tooltip label={list.systemListType ? t('system') : t('tooltip')} openDelay={500}>
        <ActionIcon className={styles.editButton} disabled={list.systemListType !== undefined} onClick={open}>
          {list.systemListType && <IconTrashOff color={'var(--gourmet-neutral-5'} size={20} />}
          {!list.systemListType && <IconTrash color={'var(--gourmet-neutral-7'} size={20} />}
        </ActionIcon>
      </Tooltip>
    </>
  );
}
