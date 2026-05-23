import { IconPlus } from '@tabler/icons-react';
import { use } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/parcels/generic/Button/Button';
import type { UserList } from '@/parcels/lists/types.ts';
import { ModalContext } from '@/parcels/modals/Modal.context';

export default function CreateListButton({ onSuccess }: { onSuccess?: (list: UserList) => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.create' });

  const { requestModal } = use(ModalContext);

  return (
    <Button
      leadingIcon={<IconPlus />}
      onClick={async () => {
        try {
          const list = await requestModal<UserList>('createList', { async: true });

          if (list && onSuccess) {
            onSuccess(list);
          }
        } catch {}
      }}
      size="sm"
    >
      {t('title')}
    </Button>
  );
}
