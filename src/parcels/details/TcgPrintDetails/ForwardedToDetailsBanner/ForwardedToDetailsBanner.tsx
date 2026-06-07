import { Button, Center, Group, Stack, UnstyledButton } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';

export function ForwardedToDetailsBanner() {
  const wasForwarded = useLocalUserStateStore((state) => state.wasDetailsForwarded);
  const { user } = useAuth();

  return (
    <>
      {wasForwarded && user?.settings?.search?.forwardToDetailPage && (
        <Stack
          w={'65%'}
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
            <Button color={'var(--gourmet-neutral-4)'}>Disable it</Button>
            <Button color={'var(--gourmet-neutral-2)'}>Keep forwarding</Button>
          </Group>
        </Stack>
      )}
    </>
  );
}
