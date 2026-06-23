import { Button, Center, Group, Stack, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { updateUserSettings } from '@/parcels/auth/api.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';

export function ForwardedToDetailsBanner() {
  const showBanner = useLocalUserStateStore((state) => state.showForwardBanner);
  const setShowBanner = useLocalUserStateStore((state) => state.setShowForwardBanner);
  const wasForwarded = useLocalUserStateStore((state) => state.wasDetailsForwarded);
  const { user, updateUser } = useAuth();

  const smallScreen = useMediaQuery('(max-width: 800px)');
  return (
    <>
      {showBanner && wasForwarded && user?.settings?.search?.forwardToDetailPage && (
        <Stack
          w={smallScreen ? '100%' : '65%'}
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
            <GourmetText cgmc={'neutral-1'}>
              We have forwarded you to the details page, since your search resulted in only one card or print.
            </GourmetText>
            <GourmetText cgmc={'neutral-1'}>
              Do you want us to continue doing so? You can change your decision in your settings any time.
            </GourmetText>
          </Stack>

          <Group justify={'end'} gap={'0.5rem'}>
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
              Disable it
            </Button>
            <Button
              color={'var(--gourmet-neutral-2)'}
              onClick={() => {
                setShowBanner(false);
              }}
            >
              Keep forwarding
            </Button>
          </Group>
        </Stack>
      )}
    </>
  );
}
