import { Center, Group, ScrollArea, SimpleGrid, Stack, Tooltip } from '@mantine/core';
import { IconArrowRight, IconDeviceVisionPro } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Badge } from '@/parcels/generic/Badge/Badge.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TcgStatisticsCarousel } from '@/parcels/homepage/Home/TcgStatisticsCarousel.tsx';
import Searchbar from '@/parcels/search/bar/Searchbar/Searchbar.tsx';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function Home() {
  // TODO: what can we add to below the searchbar?
  // - something like "new here?" closeable with some tips

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

type Update = {
  title: string;
  type: UpdateType;

  hook?: string;
  text?: string;

  link?: string;

  tcg?: Tcg;
  tcgs?: Tcg[];
  author?: string;
  authoredAt: Date;
};
type UpdateType = 'blog' | 'release' | 'changelog';

function LatestUpdatesView({ types }: { types: UpdateType[] }) {
  const allUpdates = useMemo(() => {
    return testUpdates;
  }, []);
  const filteredUpdates = useMemo(() => {
    return allUpdates
      .filter((u) => types.includes(u.type))
      .sort((a, b) => {
        return (a.authoredAt.getTime() - b.authoredAt.getTime()) * -1;
      });
  }, [types, allUpdates]);

  return (
    <Stack gap={'0.5rem'}>
      {filteredUpdates.map((u) => {
        const tcgs: Tcg[] = [u.tcg, ...(u.tcgs ?? [])].filter((t) => t !== undefined);

        return (
          <Stack
            key={u.title}
            style={{ border: '1px solid var(--gourmet-neutral-3)', borderRadius: '0.25rem' }}
            p={'0.5rem'}
            gap={'0.25rem'}
          >
            <Group justify={'space-between'} wrap={'nowrap'} align={'start'}>
              <Group wrap={'nowrap'} align={'start'}>
                <Badge size={'sm'} color={u.type === 'blog' ? 'blue' : u.type === 'release' ? 'green' : undefined}>
                  {u.type.toUpperCase()}
                </Badge>

                <GourmetText cgmff={'title'} cgmc={'neutral-9'} fw={'500'}>
                  {u.title}
                </GourmetText>
              </Group>

              <Group gap={'0.1rem'} wrap={'nowrap'}>
                {(u.tcg || u.tcgs)
                  && tcgs.map((t) => {
                    return (
                      <Tooltip key={t} label={t.toUpperCase()} openDelay={500}>
                        <TcgIcon tcg={t} size={20} color={'var(--gourmet-neutral-7)'} />
                      </Tooltip>
                    );
                  })}
              </Group>
            </Group>
            {u.hook && <Group>{u.hook}</Group>}

            <Group justify={'space-between'}>
              <GourmetText cgmff={'ui'} fz={'0.85rem'}>
                {u.authoredAt.toLocaleDateString()}
              </GourmetText>

              {u.type === 'blog' && (
                <Group gap={'0.15rem'}>
                  <GourmetText cgmff={'ui'} fz={'0.9rem'}>
                    Read more
                  </GourmetText>
                  <IconArrowRight size={18} />
                </Group>
              )}
            </Group>
          </Stack>
        );
      })}
    </Stack>
  );
}

const testUpdates: Update[] = [
  {
    title: 'Avatar: The Last Airbender',
    type: 'release',
    link: '/sets/TLA',
    tcg: 'mtg',
    authoredAt: new Date('2025-11-21'),
  },
  {
    title: 'Phantasmal Flames',
    type: 'release',
    link: '/sets/PFL',
    tcg: 'pcg',
    authoredAt: new Date('2025-11-14'),
  },
  {
    title: 'Whispers In The Well',
    type: 'release',
    link: '/sets/13',
    tcg: 'dlc',
    authoredAt: new Date('2025-11-21'),
  },
  {
    title: `Marvel's Spider-Man`,
    type: 'release',
    link: '/sets/SPM',
    tcg: 'mtg',
    authoredAt: new Date('2025-09-26'),
  },
  {
    title: `Mega Evolution`,
    type: 'release',
    link: '/sets/MEG',
    tcg: 'pcg',
    authoredAt: new Date('2025-09-26'),
  },
  {
    title: 'Fables',
    type: 'release',
    link: '/sets/12',
    tcg: 'dlc',
    authoredAt: new Date('2025-09-05'),
  },
  {
    title: 'Added new filters for Special Promo cards',
    type: 'changelog',
    tcgs: ['mtg', 'pcg'],
    authoredAt: new Date('2026-02-29'),
  },
  {
    title: 'Deprecated the "mobile" filter',
    type: 'changelog',
    tcg: 'dlc',
    authoredAt: new Date('2026-01-13'),
  },
  {
    title: `Lorwyn Eclipsed`,
    type: 'release',
    link: '/sets/LEC',
    tcg: 'mtg',
    authoredAt: new Date('2026-01-23'),
  },
  {
    title: 'Full Release inbound',
    hook: 'Our Beta phase has ended and Cardgourmet is now fully released',
    type: 'blog',
    authoredAt: new Date('2026-05-21'),
  },
  {
    title: 'Changes to our User Management',
    hook: 'After several rounds of feedback, we have changed how we manage users',
    type: 'blog',
    authoredAt: new Date('2026-03-03'),
  },
  {
    title: 'Start of our Open Beta!',
    type: 'blog',
    hook: 'After thousands of hours of development, our TCG browser is finally open for public!',
    authoredAt: new Date('2026-02-15'),
  },
  {
    title: 'Where Did HE Come From?',
    type: 'blog',
    hook: 'Also, the most important question, where did he go?',
    authoredAt: new Date('2026-01-05'),
  },
];
