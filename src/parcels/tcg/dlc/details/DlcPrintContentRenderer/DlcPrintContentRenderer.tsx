import { Divider, Group, Stack, Text } from '@mantine/core';
import { usePrintDetailsContext } from '@/parcels/details/TcgPrintDetails/TcgPrintDetailsContext.tsx';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import type { DlcDataCard, DlcDataPrint } from '@/parcels/tcg/dlc/api.ts';
import { DlcInkSymbolSVG } from '@/parcels/tcg/dlc/details/DlcInkSymbolSVG.tsx';
import { DlcOtherSymbolSVG } from '@/parcels/tcg/dlc/details/DlcOtherSymbolSVG.tsx';
import { renderRichDlcText } from '@/parcels/tcg/dlc/renderRichText.tsx';
import { dlcTransClassifications } from '@/parcels/tcg/dlc/translations/classifications.ts';
import { dlcTransType } from '@/parcels/tcg/dlc/translations/type.ts';

export function DlcPrintContentRenderer({ card, print }: { card: DlcDataCard; print: DlcDataPrint }) {
  const { lang } = usePrintDetailsContext();
  const trans = print.translations[lang ?? 'en'] ?? print.translations.en;

  const stats = [
    {
      label: 'strength',
      value: card.strength,
    },
    {
      label: 'willpower',
      value: card.willpower,
    },
    {
      label: 'lore',
      value: card.loreValue
        ? Array.from(Array(card.loreValue ?? 0).keys()).map((e) => (
            <DlcOtherSymbolSVG key={e} symbol={'lore'} size={18} color={'var(--gourmet-neutral-9)'} />
          ))
        : undefined,
    },
  ];

  return (
    <Stack w={'28rem'} align={'start'} gap={'lg'}>
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
            <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-neutral-6)'}>
              {trans.title}
            </Text>
          </Stack>
          <Group gap={'0.2rem'}>
            <Text ff={'var(--cgm-content-font-family)'}>{card.cost}</Text>
            {card.isInkwell && <DlcOtherSymbolSVG symbol={'ink'} size={26} color={'#d5b885'} />}
            {!card.isInkwell && <DlcOtherSymbolSVG symbol={'cost'} size={20} color={'var(--gourmet-neutral-9)'} />}
          </Group>
        </Group>
        <Group gap={'0.5rem'}>
          {card.inkTypes.length > 0 && (
            <Group align={'start'} gap={'0.1rem'}>
              {card.inkTypes.map((t) => (
                <DlcInkSymbolSVG key={t} symbol={t} size={22} />
              ))}
            </Group>
          )}
          <Text ff={'var(--cgm-content-font-family)'}>
            {renderType(card.type, lang ?? 'en')} —{' '}
            {card.classifications.map((c) => renderClassification(c, lang ?? 'en')).join(' ')}
          </Text>
        </Group>
      </Stack>

      {trans.abilities.length > 0 && (
        <Stack gap="md" style={{ fontFamily: 'var(--cgm-content-font-family)' }}>
          {trans.abilities.map((ability, i) => {
            return (
              <div key={i}>
                {ability.keyword ? (
                  <Typeset block>{renderRichDlcText(ability.descriptionWithReminders ?? '', ability.keyword)}</Typeset>
                ) : (
                  <Group gap="0.25rem">
                    <Badge>{ability.name}</Badge>
                    <Typeset block>{renderRichDlcText(ability.descriptionWithReminders ?? '')}</Typeset>
                  </Group>
                )}
              </div>
            );
          })}
        </Stack>
      )}

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

      {stats && (
        <Group align={'start'}>
          {stats
            .filter((s) => s.value !== undefined)
            .map((s) => {
              return (
                <Stack gap="0.125rem" key={s.label}>
                  <Kicker size="sm">{s.label}</Kicker>

                  <Text ff={'var(--cgm-content-font-family)'} fz={'md'} c={'var(--gourmet-neutral-9)'}>
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

function renderType(type: string, _: string) {
  return dlcTransType[type] ?? type;
}

function renderClassification(classi: string, _: string) {
  return dlcTransClassifications[classi] ?? classi;
}
