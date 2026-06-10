import { Center, Group, Stack } from '@mantine/core';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { renderRichMtgText } from '@/parcels/tcg/mtg/renderRichMtgText.tsx';

export function RulingsDisplay({ rulings }: { rulings: { date: string; text: string }[] }) {
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

  return (
    <Stack maw={'28rem'} gap={'0.25rem'} pos={'relative'}>
      <Center>
        <GourmetText cgmff={'title'} fz={'1.25rem'} fw={500}>
          Notes and Rulings
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
              // TODO: open all
            }}
            style={{
              width: '100%',
            }}
          >
            <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'} fw={500}>
              Show all
            </GourmetText>
          </Button>
        </Group>
      )}
    </Stack>
  );
}
