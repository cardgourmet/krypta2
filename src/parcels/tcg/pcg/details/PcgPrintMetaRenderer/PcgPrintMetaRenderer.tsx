import { Code, Group, Select, type SelectProps, Stack, Text } from '@mantine/core';
import { IconBrush, IconCaretDownFilled, IconCheck, IconDiamond, IconLanguage, IconNumber } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import type { MtgDataCard, MtgDataPrint, MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataCard, PcgDataPrint, PcgDataSet } from '@/parcels/tcg/pcg/api.ts';
import { PcgSetIcon } from '@/parcels/tcg/pcg/details/PcgSetIcon.tsx';
import { pcgSearchParamsDefaults } from '@/parcels/tcg/pcg/types.ts';
import styles from './PcgPrintMetaRenderer.module.css';

export function PcgPrintMetaRenderer({
  card,
  print,
  set,
  language,
  setLanguage,
}: {
  card: MtgDataCard | PcgDataCard;
  print: MtgDataPrint | PcgDataPrint;
  set: MtgDataSet | PcgDataSet;
  language: string;
  setLanguage: (lang: string, printId: string) => void;
}) {
  const { thisPrintLanguages, otherPrintLanguages } = useMemo(() => {
    const languageMap = {
      en: 'English',
      de: 'German',
      fr: 'French',
      es: 'Spanish',
      it: 'Italian',
      pt: 'Portuguese',
      ja: 'Japanese',
      ru: 'Russian',
      zhs: 'Simplified Chinese',
      zht: 'Traditional Chinese',
      ko: 'Korean',
    } as Record<string, string>;

    const thisPrintLanguages = Object.keys((print as PcgDataPrint).translations).map((l) => {
      return { label: languageMap[l] ?? l, value: l };
    });
    const otherPrintLanguages = card.allPrints
      .filter((p) => p.id !== print.id)
      .flatMap((p) => {
        return p.supportedLanguages.map((l) => ({ language: l, printId: p.id }));
      })
      .filter((o) => !Object.keys((print as PcgDataPrint).translations).includes(o.language));
    const otherPrintLanguagesUniq = [
      ...new Map(
        otherPrintLanguages.map((item) => {
          return [item.language, item];
        }),
      ).values(),
    ].map((o) => ({ label: languageMap[o.language] ?? o.language, value: o.language }));

    return { thisPrintLanguages, otherPrintLanguages: otherPrintLanguagesUniq };
  }, [card, print]);

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      <Code>{option.value}</Code> {option.label}
      {checked && <IconCheck style={{ marginLeft: 'auto' }} size={16} />}
    </Group>
  );

  return (
    <Stack
      style={{
        borderRadius: '0.5rem',
        flexGrow: '1',
        minHeight: '32rem',
        maxWidth: '16rem',
        marginLeft: 'auto',
      }}
    >
      <Stack gap={'xs'}>
        <Link
          to={`/$tcg/sets/$setCode`}
          params={{ tcg: 'pcg', setCode: (set as PcgDataSet).code?.toLowerCase() ?? '???' }}
          className={styles.setLink}
        >
          <Group gap={'xs'} wrap={'nowrap'} align={'start'}>
            <PcgSetIcon setCode={(set as PcgDataSet).code?.toLowerCase() ?? '???'} />
            <Stack gap={'0.25rem'}>
              <Text ff={'var(--cgm-content-font-family)'} fz={'1rem'} c={'var(--gourmet-neutral-9)'}>
                {set.translations.en.name}
              </Text>
              <Text ff={'var(--cgm-content-font-family)'} fz={'xs'} c={'var(--gourmet-neutral-7)'}>
                {set.code} &#x2022; {set.printsAvailable} Karten &#x2022; {(set as PcgDataSet).releaseStartDate}
              </Text>
            </Stack>
          </Group>
        </Link>
        <Select
          classNames={{
            root: styles.selectRoot,
            input: styles.selectInput,
            dropdown: styles.selectDropdown,
            option: styles.selectOption,
            wrapper: styles.selectWrapper,
          }}
          leftSection={<IconLanguage size={20} />}
          rightSection={<IconCaretDownFilled size={16} />}
          data={[
            {
              group: 'Diesen Print ansehen auf',
              items: thisPrintLanguages,
            },
            {
              group: 'Einen Reprint ansehen auf',
              items: otherPrintLanguages,
            },
          ]}
          maxDropdownHeight={350}
          value={language}
          onChange={(e) => {
            if (e === null) return;
            setLanguage(e, '');
          }}
          checkIconPosition="right"
          renderOption={renderSelectOption}
          disabled={thisPrintLanguages.length + otherPrintLanguages.length === 1}
        />
        <Stack py={'0.75rem'}>
          <Stack gap="0.125rem">
            <Kicker leadingIcon={<IconNumber />} size="xs">
              Collector Number
            </Kicker>

            <Text ff={'var(--cgm-content-font-family)'}>#{print.collectorNumber}</Text>
          </Stack>

          <Stack gap="0.125rem">
            <Kicker leadingIcon={<IconDiamond />} size="xs">
              Rarity
            </Kicker>

            <Link
              to={`/$tcg/cards`}
              params={{
                tcg: 'pcg',
              }}
              search={{
                ...pcgSearchParamsDefaults,
                query: `rarity:"${print.rarity}"`,
              }}
              style={{
                textDecoration: 'underline',
                textDecorationColor: 'var(--gourmet-blue-03)',
                textUnderlineOffset: '2px',
              }}
            >
              <Text ff={'var(--cgm-content-font-family)'}>{print.rarity}</Text>
            </Link>
          </Stack>

          {(print as PcgDataPrint).illustrators.length > 0 && (
            <Stack gap="0.125rem">
              <Kicker leadingIcon={<IconBrush />} size="xs">
                Artist
              </Kicker>

              <Link
                to={`/$tcg/cards`}
                params={{
                  tcg: 'pcg',
                }}
                search={{
                  ...pcgSearchParamsDefaults,
                  query: `artist:"${(print as PcgDataPrint).illustrators}"`,
                }}
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--gourmet-blue-03)',
                  textUnderlineOffset: '2px',
                }}
              >
                <Text ff={'var(--cgm-content-font-family)'}>{(print as PcgDataPrint).illustrators}</Text>
              </Link>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
