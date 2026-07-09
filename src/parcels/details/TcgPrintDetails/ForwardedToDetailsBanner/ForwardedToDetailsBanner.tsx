import { Button, Center, Group, Stack, UnstyledButton } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { updateUserSettings } from '@/parcels/auth/api.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';

export function ForwardedToDetailsBanner() {
  const { t } = useTranslation('details', { keyPrefix: 'forwarded' });

  const showBanner = useLocalUserStateStore((state) => state.showForwardBanner);
  const setShowBanner = useLocalUserStateStore((state) => state.setShowForwardBanner);
  const wasForwarded = useLocalUserStateStore((state) => state.wasDetailsForwarded);
  const { user, updateUser } = useAuth();

  return (
    <>
      {showBanner && wasForwarded && user?.settings?.search?.forwardToDetailPage && (
        <Stack
          w={'100%'}
          p={'1rem 1rem'}
          style={{
            backgroundColor: 'var(--gourmet-blue-1)',
            borderRadius: '0.25rem',
            position: 'relative',
          }}
          mb={'1rem'}
        >
          <UnstyledButton
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
            }}
            onClick={() => {
              setShowBanner(false);
            }}
          >
            <Center>
              <IconX size={18} color={'var(--gourmet-neutral-1)'} />
            </Center>
          </UnstyledButton>

          <Stack gap={'0.25rem'}>
            <GourmetText cgmc={'neutral-1'}>{t('1')}</GourmetText>
            <GourmetText cgmc={'neutral-1'}>{t('2')}</GourmetText>
          </Stack>

          <Group justify={'start'} gap={'0.5rem'}>
            <Button
              color={'var(--gourmet-neutral-4)'}
              onClick={() => {
                setShowBanner(false);

                requestAnimationFrame(async () => {
                  const res = await updateUserSettings({
                    ...user?.settings,
                    search: {
                      ...user?.settings?.search,
                      forwardToDetailPage: false,
                    },
                  });

                  if (res.error) {
                    sendErrorNotification(res.error);
                    return;
                  }

                  if (res.data) updateUser(res.data);
                });
              }}
            >
              {t('disable')}
            </Button>
            <Button
              color={'var(--gourmet-neutral-2)'}
              onClick={() => {
                setShowBanner(false);
              }}
            >
              {t('keep')}
            </Button>
          </Group>
        </Stack>
      )}
    </>
  );
}
