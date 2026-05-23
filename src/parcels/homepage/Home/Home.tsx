import { Center, Group, ScrollArea, SimpleGrid, Stack } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { IconBowlChopsticks } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { LatestPostsView } from '@/parcels/homepage/Home/LatestUpdatesView/LatestPostsView.tsx';
import { NewHereBanner } from '@/parcels/homepage/Home/NewHereBanner/NewHereBanner.tsx';
import { TcgStatisticsCarousel } from '@/parcels/homepage/Home/TcgStatisticsCarousel/TcgStatisticsCarousel.tsx';
import Searchbar from '@/parcels/search/bar/Searchbar/Searchbar.tsx';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';

export const CGM_NEW_HERE = 'cgm-new-here';

export function Home() {
  const { t } = useTranslation('home');
  const { tcg } = useTcg();
  const [newHere, setNewHere] = useLocalStorage({
    key: CGM_NEW_HERE,
    defaultValue: true,
    getInitialValueInEffect: true,
  });

  const smallScreen = useMediaQuery('(max-width: 800px)');
  const tinyScreen = useMediaQuery('(max-width: 565px)');

  return (
    <Stack>
      <Center style={{ marginTop: '2rem' }}>
        <Stack gap={'0.4rem'}>
          <GourmetText
            cgmff={'title'}
            c={'var(--gourmet-neutral-9)'}
            fz={'h1'}
            style={{ textAlign: 'center', lineHeight: '2.25rem' }}
          >
            <Trans i18nKey={'welcome.title'} t={t}>
              Welcome to <span style={{ color: 'var(--gourmet-blue-1)', fontWeight: 600 }}>Cardgourmet</span>
            </Trans>
          </GourmetText>

          <Group justify={tinyScreen ? 'center' : 'end'} p={'0 0.5rem'}>
            <GourmetText cgmff={'title'} cgmc={'neutral-9'} fw={'500'} fs={'italic'}>
              {t('welcome.subtitle')}
            </GourmetText>
          </Group>
        </Stack>
      </Center>

      <Center style={{ marginTop: '1rem' }}>
        <Stack gap={'0.25rem'} w={'min(100%, 42rem)'}>
          <Stack w={'100%'}>
            <Searchbar
              styles={{
                '--modal-layer': 'var(--overlay-layer)',
                width: '100%',
              }}
              inputWrapperStyles={{
                width: '100%',
              }}
              inputStyles={{
                fontSize: '1.25rem',
                height: '3rem',
                width: '100%',
              }}
              modalStyles={{
                '--shift-top': '4rem',
              }}
              omitHelp
              iconSize={22}
              caretIconSize={16}
            />
          </Stack>

          <Group justify={'end'}>
            <Link to={'/$tcg/advanced'} params={{ tcg: tcg }} style={{ textDecoration: 'none' }}>
              <Group gap={'0.25rem'}>
                <IconBowlChopsticks size={18} color={'var(--gourmet-blue-1)'} />
                <GourmetText c={'var(--gourmet-blue-1)'}>Search Cooker</GourmetText>
              </Group>
            </Link>
          </Group>
        </Stack>
      </Center>

      {newHere && (
        <Center>
          <NewHereBanner setNewHere={setNewHere} />
        </Center>
      )}

      <SimpleGrid cols={smallScreen ? 1 : 3} mt={'1.5rem'}>
        <Stack>
          <GourmetText cgmff={'ui'} fz={'1.1rem'} fw={500}>
            {t('latest.posts.title')}
          </GourmetText>

          <ScrollArea h={'420'} offsetScrollbars scrollbarSize={4}>
            <LatestPostsView types={['blog']} />
          </ScrollArea>
        </Stack>

        <Stack>
          <GourmetText cgmff={'ui'} fz={'1.1rem'} fw={500}>
            {t('latest.updates.title')}
          </GourmetText>

          <ScrollArea h={'420'} offsetScrollbars scrollbarSize={4}>
            <LatestPostsView types={['release', 'changelog']} />
          </ScrollArea>
        </Stack>

        <Stack>
          <GourmetText cgmff={'ui'} fz={'1.1rem'} fw={500}>
            {t('latest.tcgOverviews.title')}
          </GourmetText>

          <TcgStatisticsCarousel />
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
