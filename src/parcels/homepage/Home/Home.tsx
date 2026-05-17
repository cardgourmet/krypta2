import { Center, Group, ScrollArea, SimpleGrid, Stack } from '@mantine/core';
import { IconDeviceVisionPro } from '@tabler/icons-react';
import { useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { LatestUpdatesView } from '@/parcels/homepage/Home/LatestUpdatesView/LatestUpdatesView.tsx';
import { NewHereBanner } from '@/parcels/homepage/Home/NewHereBanner/NewHereBanner.tsx';
import { TcgStatisticsCarousel } from '@/parcels/homepage/Home/TcgStatisticsCarousel/TcgStatisticsCarousel.tsx';
import Searchbar from '@/parcels/search/bar/Searchbar/Searchbar.tsx';

export function Home() {
  const [newHere, setNewHere] = useState(true);

  return (
    <Stack>
      <Center style={{ marginTop: '2rem' }}>
        <Stack gap={'0'}>
          <GourmetText cgmff={'title'} c={'var(--gourmet-neutral-9)'} fz={'h1'}>
            Welcome to <span style={{ color: 'var(--gourmet-blue-1)', fontWeight: 600 }}>Cardgourmet</span>
          </GourmetText>

          <Group justify={'end'} p={'0 0.5rem'}>
            <GourmetText cgmff={'title'} cgmc={'neutral-9'} fw={'500'} fs={'italic'}>
              A TCG Card Browser
            </GourmetText>
          </Group>
        </Stack>
      </Center>

      <Center style={{ marginTop: '1rem' }}>
        <Stack gap={'0.15rem'}>
          <Searchbar
            inputStyles={{
              fontSize: '1.25rem',
              height: '3rem',
            }}
            modalStyles={{
              '--shift-top': '4rem',
            }}
            omitHelp
            iconSize={22}
            caretIconSize={16}
          />

          <Group justify={'end'}>
            <Group gap={'0.25rem'}>
              <IconDeviceVisionPro size={18} color={'var(--gourmet-blue-1)'} />
              <GourmetText c={'var(--gourmet-blue-1)'}>Advanced Search</GourmetText>
            </Group>
          </Group>
        </Stack>
      </Center>

      {newHere && (
        <Center>
          <NewHereBanner setNewHere={setNewHere} />
        </Center>
      )}

      <SimpleGrid cols={3} mt={'1.5rem'}>
        <Stack>
          <GourmetText>Latest Posts</GourmetText>

          <ScrollArea h={'420'} offsetScrollbars scrollbarSize={4}>
            <LatestUpdatesView types={['blog']} />
          </ScrollArea>
        </Stack>

        <Stack>
          <GourmetText>Latest Updates</GourmetText>

          <ScrollArea h={'420'} offsetScrollbars scrollbarSize={4}>
            <LatestUpdatesView types={['release', 'changelog']} />
          </ScrollArea>
        </Stack>

        <Stack>
          <GourmetText>TCG Overviews</GourmetText>

          <TcgStatisticsCarousel />
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
