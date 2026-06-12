import { Center, Drawer, Group, Stack } from '@mantine/core';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { renderRichMtgText } from '@/parcels/tcg/mtg/renderRichMtgText.tsx';

export function RulingsDisplay({ rulings }: { rulings: { date: string; text: string }[] }) {
  const { t } = useTranslation('details', { keyPrefix: 'rulings' });

  const rulingsRef = useRef<HTMLDivElement | null>(null);
  const [rulingsOverflowing, setRulingsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const element = rulingsRef.current;
    if (!element) return;

    const updateOverflow = () => {
      setRulingsOverflowing(element.scrollHeight > element.clientHeight);
    };

    updateOverflow();

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Drawer
        title={
          <GourmetText cgmff={'ui'} fz={'1.25rem'} fw={500}>
            {t('title')}
          </GourmetText>
        }
        position={'right'}
        opened={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Stack gap={'0.75rem'} h={'20rem'}>
          {rulings.map((r, index) => {
            return (
              <Stack key={`${r.date}_${index}`} gap={'0'}>
                <GourmetText cgmff={'content'} lh={'1.25rem'}>
                  {renderRichMtgText(r.text)}
                </GourmetText>
                <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
                  {r.date}
                </GourmetText>
              </Stack>
            );
          })}
        </Stack>
      </Drawer>

      <Stack maw={'28rem'} gap={'0.25rem'} pos={'relative'}>
        <Center>
          <GourmetText cgmff={'title'} fz={'1.25rem'} fw={500}>
            {t('title')}
          </GourmetText>
        </Center>

        <Stack
          ref={rulingsRef}
          gap={'0.75rem'}
          h={'20rem'}
          style={{
            border: '1px solid var(--gourmet-neutral-3)',
            borderRadius: '0.5rem',
            padding: '1rem 1.5rem',
            overflow: 'hidden',
          }}
        >
          {rulings.map((r, index) => {
            return (
              <Stack key={`${r.date}_${index}`} gap={'0'}>
                <GourmetText cgmff={'content'} lh={'1.25rem'}>
                  {renderRichMtgText(r.text)}
                </GourmetText>
                <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
                  {r.date}
                </GourmetText>
              </Stack>
            );
          })}
        </Stack>

        {rulingsOverflowing && (
          <Group
            w={'100%'}
            style={{
              position: 'absolute',
              bottom: 0,
              background:
                'linear-gradient(to bottom, color-mix(in srgb, var(--gourmet-neutral-1) 0%, transparent), color-mix(in srgb, var(--gourmet-neutral-1) 100%, transparent))',
            }}
            h={'7.5rem'}
            align={'end'}
            pb={'0.25rem'}
          >
            <Button
              accent="brand"
              size="sm"
              variant="tertiary"
              onClick={() => {
                setSidebarOpen(true);
              }}
              style={{
                width: '100%',
              }}
            >
              <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'} fw={500}>
                {t('showAll')}
              </GourmetText>
            </Button>
          </Group>
        )}
      </Stack>
    </>
  );
}
