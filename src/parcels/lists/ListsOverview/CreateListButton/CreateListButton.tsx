import {Button} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconPlus} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type {UserList} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export default function CreateListButton({ onSuccess }: { onSuccess?: (list: UserList) => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'create' });

  const disclosure = useDisclosure(false);
  const [_, { open }] = disclosure;

  return (
    <>
      <CreateListModal disclosure={disclosure} onSuccess={onSuccess} />

      <Button
        color={'var(--gourmet-blue-1)'}
        leftSection={<IconPlus size={20} color={'var(--gourmet-neutral-1'} />}
        h={'1.75rem'}
        p={'0 0.5rem'}
        onClick={open}
      >
        <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'} fw={500}>
          {t('title')}
        </GourmetText>
      </Button>
    </>
  );
}
