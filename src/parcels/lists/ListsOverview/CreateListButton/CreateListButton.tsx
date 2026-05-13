import {useDisclosure} from '@mantine/hooks';
import {IconPlus} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {Button} from '@/parcels/generic/Button/Button';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type {UserList} from '@/parcels/lists/types.ts';

export default function CreateListButton({ onSuccess }: { onSuccess?: (list: UserList) => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.create' });

  const disclosure = useDisclosure(false);
  const [_, { open }] = disclosure;

  return (
    <>
      <CreateListModal disclosure={disclosure} onSuccess={onSuccess} />

      <Button leadingIcon={<IconPlus />} onClick={open} size="sm">
        {t('title')}
      </Button>
    </>
  );
}
