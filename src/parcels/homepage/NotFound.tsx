import { Center, Group, Image, Stack } from '@mantine/core';
import notFoundCardImage from '@/assets/catgourmet_empty_fridge.png';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export function NotFound(_: { data: Record<string, string> }) {
  return (
    <Group justify={'center'} mt={'2rem'}>
      <Stack>
        <Stack gap={'0'}>
          <Image src={notFoundCardImage} w={'100%'} maw={400} />
          <Group pl={'0.5rem'}>
            <GourmetText cgmff={'ui'} cgmc={'neutral-4'}>
              Artwork by @sitaduncan
            </GourmetText>
          </Group>
        </Stack>
        <Stack gap={'0'}>
          <Center>
            <GourmetText cgmff={'title'} fz={'3.5rem'} fw={600}>
              404
            </GourmetText>
          </Center>
          <GourmetText cgmff={'ui'} fz={'1.5rem'}>
            I couldn't find the page you were looking for
          </GourmetText>
        </Stack>
      </Stack>
    </Group>
  );
}
