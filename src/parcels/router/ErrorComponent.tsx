import { MantineProvider, Stack } from '@mantine/core';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export function ErrorComponent({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'Unknown :(';

  return (
    <MantineProvider>
      <Stack>
        <GourmetText>There has been error: {message}</GourmetText>
      </Stack>
    </MantineProvider>
  );
}
