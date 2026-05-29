import { Divider, Group, Stack, type StackProps, Text } from '@mantine/core';
import { useMemo } from 'react';
import { usePrintDetailsContext } from '@/parcels/details/TcgPrintDetails/TcgPrintDetailsContext.tsx';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import type { MtgDataPrintFace } from '@/parcels/tcg/mtg/api.ts';
import { MtgColorIndicator } from '@/parcels/tcg/mtg/details/MtgColorIndicator/MtgColorIndicator.tsx';
import { MtgSymbolSVG } from '@/parcels/tcg/mtg/details/MtgSymbolSVG/MtgSymbolSVG.tsx';
import { renderRichText } from '@/parcels/tcg/mtg/renderRichText.tsx';

export function MtgPrintFaceContentRenderer({ print, ...styles }: { print: MtgDataPrintFace } & StackProps) {
  const { lang } = usePrintDetailsContext();
  const trans = print.translations[lang] ?? print.translations.en;
  const colorIndicator = print.colorIndicator.map((d) => `{${d}}`).join('/');

  const stats = [
    { label: 'power', value: print.power?.display },
    { label: 'toughness', value: print.toughness?.display },
    { label: 'loyalty', value: print.loyalty?.display },
    { label: 'defense', value: print.defense?.display },
  ];
  const statsFiltered = stats.filter((s) => s.value !== undefined);

  const manaCostParts = useMemo(() => {
    const manaDisplayRegex = /\{[^{}]}/g;

    return (
      print.manaDisplay?.match(manaDisplayRegex)?.map((m) => {
        return m;
      }) ?? []
    );
  }, [print.manaDisplay]);

  return (
    <Stack {...styles}>
      <Stack gap={'xs'} style={{ width: '100%' }}>
        <Group align={'start'} justify={'space-between'} style={{ width: '100%' }} wrap={'nowrap'}>
          <Stack gap={'0.1rem'}>
            <Text
              ff={'var(--cgm-content-font-family)'}
              fw={'bold'}
              fz={'1.1rem'}
              c={'var(--gourmet-neutral-9)'}
              style={{ flexGrow: 1 }}
            >
              {trans.name}
            </Text>
            {trans.flavorName && (
              <Text ff={'var(--cgm-content-font-family)'} fs={'italic'} c={'var(--gourmet-neutral-6)'}>
                {trans.flavorName}
              </Text>
            )}
          </Stack>
          <Group wrap={'nowrap'} gap={'0.2rem'} h={'calc(1rem * var(--mantine-line-height-md))'}>
            {manaCostParts.map((p, i) => (
              <MtgSymbolSVG key={i} symbol={p as `{$string}`} size={16} />
            ))}
          </Group>
        </Group>
        <Text ff={'var(--cgm-content-font-family)'}>
          {colorIndicator.length > 0 && <MtgColorIndicator colors={print.colorIndicator} />}
          {trans.typeLine}
        </Text>
      </Stack>

      <Stack gap={'sm'}>
        {trans.oracleText?.split('\n').map((line, i) => (
          <Text ff={'var(--cgm-content-font-family)'} key={i}>
            {renderRichText(line)}
          </Text>
        ))}
      </Stack>

      {trans.flavorText && (
        <>
          <Divider
            w={'95%'}
            style={{ alignSelf: 'center', marginBottom: '-0.5rem' }}
            color={'var(--gourmet-neutral-3)'}
          />
          <Typeset
            asChild
            block
            style={{ fontFamily: 'var(--cgm-serif-font-family)' }}
            variant="secondary"
            weight={500}
          >
            <em>{trans.flavorText}</em>
          </Typeset>
        </>
      )}

      {statsFiltered.length > 0 && (
        <Group>
          {statsFiltered.map((s) => {
            return (
              <Stack gap="0.125rem" key={s.label}>
                <Kicker size="sm">{s.label}</Kicker>

                <Text ff={'var(--cgm-content-font-family)'} fz={'md'} fw={'bold'} c={'var(--gourmet-neutral-9)'}>
                  {s.value}
                </Text>
              </Stack>
            );
          })}
        </Group>
      )}
    </Stack>
  );
}
