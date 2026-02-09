import {Divider, Group, Stack, Text} from '@mantine/core';
import {Link} from '@tanstack/react-router';
import type {ReactElement} from 'react';
import {capitalizeFirstLetter} from '@/parcels/capitalizeFirstLetter.ts';
import type {PcgDataCard, PcgDataPrint} from '@/parcels/tcg/pcg/api.ts';
import {PcgSymbolSVG} from '@/parcels/tcg/pcg/details/PcgSymbolSVG.tsx';
import {renderRichPcgText} from '@/parcels/tcg/pcg/renderRichText.tsx';
import {pcgSubtypesMapping} from '@/parcels/tcg/pcg/translations/subtypes.ts';
import {pcgSupertypesMapping} from '@/parcels/tcg/pcg/translations/supertypes.ts';
import {pcgSearchParamsDefaults} from '@/parcels/tcg/pcg/types.ts';
import type {components as c} from '@/schema/api';

export function PcgPrintContentRenderer({ card, print }: { card: PcgDataCard; print: PcgDataPrint }) {
  const trans = print.translations.en;

  const stats = [
    {
      label: 'weakness',
      value:
        card.weaknessTypes.length > 0
          ? `${card.weaknessTypes.map((d) => `{${d}}`).join('')} ${card.weaknessModifier}`
          : undefined,
    },
    {
      label: 'resistance',
      value:
        card.resistanceTypes.length > 0
          ? `${card.resistanceTypes.map((d) => `{${d}}`).join('')} ${card.resistanceModifier}`
          : undefined,
    },
    {
      label: 'retreat',
      value: card.retreatCost
        ? Array.from(Array(card.retreatCost ?? 0).keys())
            .map(() => '{C}')
            .join('')
        : undefined,
    },
  ];

  return (
    <Stack w={'28rem'} align={'start'} gap={'lg'} p={'sm'}>
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
              {renderName(trans.name, card)}
            </Text>
          </Stack>
          <Group gap={'0.5rem'} wrap={'nowrap'} align={'start'}>
            {card.hp && (
              <Group gap={'0.1rem'} wrap={'nowrap'}>
                <Text fz={'0.75rem'} ff={'var(--cgm-content-font-family)'}>
                  HP
                </Text>
                <Text ff={'var(--cgm-content-font-family)'}>{card.hp}</Text>
              </Group>
            )}
            {card.types.length > 0 && (
              <Group align={'start'}>
                {card.types.map((t) => (
                  <PcgSymbolSVG key={t} symbol={t} size={22} />
                ))}
              </Group>
            )}
          </Group>
        </Group>
        <Group gap={'0.25rem'}>
          <Text ff={'var(--cgm-content-font-family)'}>{renderTypeline(card.superType, card.subTypes, 'en')}</Text>
          {card.evolvesFrom && (
            <>
              <Text ff={'var(--cgm-content-font-family)'}>—</Text>
              <Group gap={'0.25rem'}>
                <Text ff={'var(--cgm-content-font-family)'}>{capitalizeFirstLetter(card.evolutionStage ?? '')},</Text>
                <Text ff={'var(--cgm-content-font-family)'}>
                  Evolves from{' '}
                  <Link
                    to={'/pcg/cards'}
                    search={{
                      ...pcgSearchParamsDefaults,
                      query: `name:"${card.evolvesFrom}"`,
                    }}
                    style={{
                      textDecoration: 'underline',
                      textDecorationColor: 'var(--gourmet-blue-03)',
                      textUnderlineOffset: '2px',
                      color: 'inherit',
                    }}
                  >
                    {card.evolvesFrom}
                  </Link>
                </Text>
              </Group>
            </>
          )}
        </Group>
      </Stack>
      {trans.abilities.length > 0 && (
        <Stack gap={'sm'}>
          {trans.abilities.map((a) => {
            return (
              <Stack key={a.name} gap={'0.25rem'}>
                <Group>
                  <Text
                    ff={'var(--cgm-content-font-family)'}
                    fz={'sm'}
                    style={{
                      border: '1px solid var(--gourmet-red-01)',
                      borderRadius: '0.5rem',
                    }}
                    c={'var(--gourmet-red-01)'}
                    p={'0.15rem 0.75rem'}
                  >
                    Ability
                  </Text>
                  <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-red-01)'}>
                    {a.name}
                  </Text>
                </Group>
                <Text ff={'var(--cgm-content-font-family)'}>{renderRichPcgText(a.text ?? '', true)}</Text>
              </Stack>
            );
          })}
        </Stack>
      )}
      {trans.attacks.length > 0 && (
        <Stack gap={'lg'}>
          {trans.attacks.map((a) => {
            return (
              <Stack key={a.name} gap={'0.25rem'}>
                <Group>
                  {a.cost.length > 0 && a.cost[0] !== 'free' && (
                    <Group gap={'0.25rem'} wrap={'nowrap'}>
                      {a.cost.map((t, index) => (
                        <PcgSymbolSVG key={`${t}_${index}`} symbol={t} size={18} />
                      ))}
                    </Group>
                  )}
                  <Text ff={'var(--cgm-content-font-family)'} fw="bold" style={{ flexGrow: 1 }}>
                    {a.name}
                  </Text>
                  <Text ff={'var(--cgm-content-font-family)'} fw="bold">
                    {a.damage}
                  </Text>
                </Group>
                <Text ff={'var(--cgm-content-font-family)'}>{renderRichPcgText(a.text ?? '', true)}</Text>
              </Stack>
            );
          })}
        </Stack>
      )}

      {trans.texts.length > 0 && (
        <Stack gap={'lg'}>
          {trans.texts.map((t) => (
            <Text key={t.length} ff={'var(--cgm-content-font-family)'}>
              {renderRichPcgText(t, true)}
            </Text>
          ))}
        </Stack>
      )}

      {trans.flavorText && (
        <>
          <Divider w={'95%'} style={{ alignSelf: 'center' }} color={'var(--gourmet-neutral-3)'} />
          <Text ff={'var(--cgm-serif-font-family)'} fs={'italic'}>
            {trans.flavorText}
          </Text>
        </>
      )}

      {stats && (
        <Group>
          {stats
            .filter((s) => s.value !== undefined)
            .map((s) => {
              return (
                <Stack key={s.label} gap={'0.15rem'}>
                  <Text ff={'var(--cgm-content-font-family)'} fz={'xs'} c={'var(--gourmet-neutral-6)'}>
                    {s.label.toUpperCase()}
                  </Text>
                  <Text ff={'var(--cgm-content-font-family)'} fz={'md'} c={'var(--gourmet-neutral-9)'}>
                    {renderRichPcgText(s.value?.replace('x', '×') ?? '')}
                  </Text>
                </Stack>
              );
            })}
        </Group>
      )}
    </Stack>
  );
}

function renderName(name: string, _: PcgDataCard): ReactElement {
  return <span>{renderRichPcgText(name, true)}</span>;
}

function renderTypeline(
  supertype: c['schemas']['PcgDataCard']['superType'],
  subtypes: string[],
  _: 'en' | 'de',
): string {
  return [
    pcgSupertypesMapping[supertype] ?? supertype,
    ...subtypes.map((subtype) => pcgSubtypesMapping[subtype] ?? subtype),
  ].join(' ');
}
