import { IconTrash } from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { deleteLists } from '@/parcels/lists/api.ts';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { Modal } from '@/parcels/modals/Modal.tsx';
import type { ExtendModalProps } from '@/parcels/modals/types.ts';
import { ListDeleteNotification } from '@/parcels/notification/list/ListDeleteNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';

export const DeleteListModal = ({
  innerProps: { list },
  ...props
}: ExtendModalProps<{ list: UserListWithResources }>) => {
  const { t } = useTranslation('lists', { keyPrefix: 'modal' });

  const auth = useAuth();

  return (
    <Modal {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!auth.user) return;

          deleteLists(auth.user.id, [list.list.id]).then(({ error }) => {
            if (error) {
              sendErrorNotification(error);
              return;
            }

            sendNotification('success', <ListDeleteNotification list={list.list} />);

            props.onResolve?.(list.list);
            props.onClose?.();
          });
        }}
      >
        <Modal.Content>
          <FeaturedIcon size="md" variant="secondary">
            <IconTrash />
          </FeaturedIcon>

          <Modal.Title>{t('deleteList')}</Modal.Title>
          {(list.size ?? 0) > 0 && (
            <GourmetText>
              <Trans
                i18nKey="deleteListNonEmpty"
                t={t}
                values={{
                  name: list.list.name,
                  size: list.size,
                }}
              >
                This will delete the list <b>{list.list.name}</b> along with its <b>{list.size}</b>
                resource(s).
              </Trans>
            </GourmetText>
          )}

          {(list.size ?? 0) === 0 && (
            <Trans
              i18nKey="deleteListEmpty"
              t={t}
              values={{
                name: list.list.name,
              }}
            >
              This will delete the list <b>{list.list.name}</b>. It's empty though.
            </Trans>
          )}
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
          <Modal.PrimaryButton type="submit">{t('submitDelete')}</Modal.PrimaryButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
