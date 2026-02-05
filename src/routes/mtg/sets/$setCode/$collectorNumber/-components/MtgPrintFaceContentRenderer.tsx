import {Group, Stack, Text} from "@mantine/core";
import {useMemo} from "react";
import type {MtgDataPrintFace} from "@/parcels/tcg/mtg/api.ts";
import {MtgColorIndicator} from "@/parcels/tcg/mtg/MtgColorIndicator/MtgColorIndicator.tsx";
import {MtgSymbolSVG} from "@/parcels/tcg/mtg/MtgSymbolSVG/MtgSymbolSVG.tsx";

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
      <Stack gap={'xs'} style={{ width: '100%' }}>
        <Group align={'start'} justify={'space-between'} style={{ width: '100%' }} wrap={'nowrap'}>
          <Text
            ff={'var(--cgm-content-font-family)'}
            fw={'bold'}
            fz={'1.1rem'}
            c={'var(--gourmet-neutral-9)'}
            style={{ flexGrow: 1 }}
          >
            {trans.name}
          </Text>
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

      <Text ff={'var(--cgm-content-font-family)'}>{trans.flavorName}</Text>
      <Stack gap={'sm'}>
        {trans.oracleText?.split('\n').map((line, i) => (
          <Text ff={'var(--cgm-content-font-family)'} key={i}>
            {line}
          </Text>
        ))}
      </Stack>
      <Text ff={'var(--cgm-serif-font-family)'} fs={'italic'}>
        {trans.flavorText}
      </Text>

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
