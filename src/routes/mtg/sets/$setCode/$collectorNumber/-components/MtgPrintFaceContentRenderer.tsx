import { Divider, Group, Stack, Text } from '@mantine/core';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import reactStringReplace from 'react-string-replace';
import type { MtgDataPrintFace } from '@/parcels/tcg/mtg/api.ts';
import { MtgColorIndicator } from '@/parcels/tcg/mtg/MtgColorIndicator/MtgColorIndicator.tsx';
import { MtgSymbolSVG } from '@/parcels/tcg/mtg/MtgSymbolSVG/MtgSymbolSVG.tsx';

export function MtgPrintFaceContentRenderer({ print }: { print: MtgDataPrintFace }) {
  const trans = print.translations.en;
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
    <Stack w={'20rem'} align={'start'} gap={'sm'} p={'sm'}>
      <Stack gap={'sm'} style={{ width: '100%' }}>
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
            {renderOracleLine(line)}
          </Text>
        ))}
      </Stack>
      {trans.flavorText && (
        <>
          <Divider w={'95%'} style={{ alignSelf: 'center' }} color={'var(--gourmet-neutral-3)'} />
          <Text ff={'var(--cgm-serif-font-family)'} fs={'italic'}>
            {trans.flavorText}
          </Text>
        </>
      )}

      {statsFiltered.length > 0 && (
        <Group>
          {statsFiltered.map((s) => {
            return (
              <Stack key={s.label} gap={'0.15rem'}>
                <Text ff={'var(--cgm-content-font-family)'} fz={'xs'} c={'var(--gourmet-neutral-6)'}>
                  {s.label.toUpperCase()}
                </Text>
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

function renderOracleLine(line: string): ReactElement {
  let formattedLine: ReactNode[] = [line];
  const symbolRegex = /\{(?<symbol>.+?)}/g;

  formattedLine = reactStringReplace(formattedLine, /\((.*?)\)/g, (match, index) => {
    const innerRichContent = reactStringReplace(match, symbolRegex, (match, index) => (
      <span
        key={match + index}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          height: '21px' /* idk why: 'calc(1rem * var(--mantine-line-height-md))' doesnt work ...*/,
          marginLeft: '0.15rem',
          marginRight: '0.15rem',
        }}
      >
        <MtgSymbolSVG symbol={`{${match}}`} size={16} />
      </span>
    ));

    return (
      <em key={match + index} style={{ color: 'var(--gourmet-neutral-6)' }}>
        (
        {innerRichContent.map((node, index) =>
          typeof node === 'string' && !!node ? <span key={node + index}>{node}</span> : node,
        )}
        )
      </em>
    );
  });

  formattedLine = reactStringReplace(formattedLine, symbolRegex, (match, index) => {
    return (
      <span
        key={match + index}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          height: '21px' /* idk why: 'calc(1rem * var(--mantine-line-height-md))' doesnt work ...*/,
          marginLeft: '0.15rem',
          marginRight: '0.15rem',
        }}
      >
        <MtgSymbolSVG symbol={`{${match}}`} size={16} />
      </span>
    );
  });

  return <>{formattedLine}</>;
}
