import { IconPencil } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon';
import { Modal } from '@/parcels/modals/Modal';
import type { ExtendModalProps } from '@/parcels/modals/types';
import { useGourmetNotification } from '@/parcels/notification/useGourmetNotification';
import { updateList } from '../../api';
import { ListPropertiesFormFields } from '../../forms/ListPropertiesForm/ListPropertiesFormFields';
import type { ListPropertiesFormValues } from '../../forms/ListPropertiesForm/types';
import { useListPropertiesForm } from '../../forms/ListPropertiesForm/useListPropertiesForm';
import type { UserList } from '../../types';

export const EditListModal = ({ innerProps: { list }, ...props }: ExtendModalProps<{ list: UserList }>) => {
  const { t } = useTranslation('lists', { keyPrefix: 'modal' });

  const auth = useAuth();
  const form = useListPropertiesForm({ list });
  const noti = useGourmetNotification();

  const handleSubmit = (values: ListPropertiesFormValues) => {
    if (!auth.user) return;

    const updated = {
      ...list,
      ...values,
      color: values.color === 'default' ? undefined : values.color,
    } as Partial<UserList> & { name: string };

    updateList(auth.user.id, updated).then(({ error }) => {
      if (error) {
        noti.show('Unknown error', `${error}`, 'error');
        return;
      }

      noti.show('List Edited', `\`${list.name}\` has been edited`, 'success');

      props.onResolve?.(updated as UserList);
      props.onClose?.();
    });
  };

  return (
    <Modal {...props}>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))} style={{ display: 'contents' }}>
        <Modal.Content>
          <FeaturedIcon size="md" variant="secondary">
            <IconPencil />
          </FeaturedIcon>

          <Modal.Title>{t('editList')}</Modal.Title>

          <ListPropertiesFormFields
            advancedDefaultExpanded
            form={form}
            style={{ marginTop: '1.25rem' }}
            isSystem={list.systemListType === 'favorites'}
          />
        </Modal.Content>
        <Modal.Footer>
          <Modal.SecondaryButton
            onClick={() => {
              props.onReject?.();
              props.onClose?.();
            }}
          >
            {t('cancel')}
          </Modal.SecondaryButton>
          <Modal.PrimaryButton type="submit">{t('save')}</Modal.PrimaryButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
