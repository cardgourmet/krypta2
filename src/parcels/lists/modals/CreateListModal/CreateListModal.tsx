import { UnstyledButton } from '@mantine/core';
import { IconCards, IconExchange, IconPhoto, IconPlaylistAdd, IconShoppingBagHeart } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { Modal } from '@/parcels/modals/Modal';
import type { ExtendModalProps } from '@/parcels/modals/types';
import { useGourmetNotification } from '@/parcels/notification/useGourmetNotification';
import { createList } from '../../api';
import { ListPropertiesFormFields } from '../../forms/ListPropertiesForm/ListPropertiesFormFields';
import type { ListPropertiesFormValues } from '../../forms/ListPropertiesForm/types';
import { useListPropertiesForm } from '../../forms/ListPropertiesForm/useListPropertiesForm';
import type { UserList } from '../../types';

const presets: { color: string; icon: ReactNode; name: string }[] = [
  {
    color: '#49da9a',
    icon: <IconPhoto style={{ color: '#49da9a' }} />,
    name: 'Awesome Artworks',
  },
  {
    color: '#eb7532',
    icon: <IconExchange style={{ color: '#eb7532' }} />,
    name: 'Interesting Mechanics',
  },
  {
    color: '#4355db',
    icon: <IconCards style={{ color: '#4355db' }} />,
    name: 'New Deck',
  },
  {
    color: '#d23be7',
    icon: <IconShoppingBagHeart style={{ color: '#d23be7' }} />,
    name: 'Birthday Wishlist',
  },
];

export const CreateListModal = ({ innerProps, ...props }: ExtendModalProps) => {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.create' });

  const auth = useAuth();
  const form = useListPropertiesForm();
  const noti = useGourmetNotification();

  const handleSubmit = (values: ListPropertiesFormValues) => {
    if (!auth.user) return;

    const list = {
      ...values,
      color: values.color === 'default' ? undefined : values.color,
    } as Partial<UserList> & { name: string };

    createList(auth.user.id, list).then(({ data, error }) => {
      if (error) {
        console.error('Error creating list', error.error?.message);
        noti.show('Unknown error', `${error.error?.message}`, 'error');
        return;
      }

      noti.show('List Created', `\`${data?.name}\` has been created`, 'success');

      props.onResolve?.(data as UserList);
      props.onClose?.();
    });
  };

  return (
    <Modal {...props}>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))} style={{ display: 'contents' }}>
        <Modal.Content>
          <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <FeaturedIcon size="lg" variant="secondary">
              <IconPlaylistAdd />
            </FeaturedIcon>

            <Modal.Title>{t('title')}</Modal.Title>

            {/* <div style={{ textWrap: 'balance' }}>
              Nutze unsere praktischen Vorschläge oder konfiguriere eine Liste individuell nach deinen Wünschen.
            </div> */}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
                marginTop: '1.25rem',
              }}
            >
              <Typeset weight={500} variant="tertiary">
                e.g.
              </Typeset>
              {presets.map((preset) => (
                <Badge asChild interactive leadingIcon={preset.icon} key={preset.name}>
                  <UnstyledButton
                    onClick={() =>
                      form.setValues({
                        color: preset.color,
                        name: preset.name,
                      })
                    }
                  >
                    {preset.name}
                  </UnstyledButton>
                </Badge>
              ))}
            </div>
          </div>

          <ListPropertiesFormFields form={form} style={{ marginTop: '1.25rem' }} />
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
          <Modal.PrimaryButton type="submit">{t('create')}</Modal.PrimaryButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
