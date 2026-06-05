import { Code, Group, Select, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCaretDownFilled, IconCheck, IconDiamond, IconHash, IconLanguage, IconPlayCard } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { MtgDataPrint } from '@/parcels/tcg/mtg/api.ts';
import { TcgSetIcon } from '@/parcels/tcg/TcgSetIcon.tsx';
import { type TcgDataCard, type TcgDataPrint, type TcgDataSet, tcgSearchParamsDefaults } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { tcgSetParamsDefaults } from '@/routes/$tcg/sets/$setCode';
import styles from './TcgPrintMeta.module.css';

export function TcgPrintMeta({
  tcg,
  card,
  set,
  lang,
  setLang,
}: {
  tcg: Tcg;
  card: TcgDataCard;
  set: TcgDataSet;
  lang: string;
  setLang: (lang: string, _: string) => void;
}) {
  const smallScreen = useMediaQuery('(max-width: 950px)');
  return (
    <Group
      align={'start'}
      ml={smallScreen ? '' : 'auto'}
      maw={smallScreen ? '' : '16rem'}
      miw={'19rem'}
      mih={'32rem'}
      w={smallScreen ? '100%' : ''}
      justify={smallScreen ? 'center' : 'start'}
    >
      <TcgPrintMetaRenderer tcg={tcg} card={card} set={set} language={lang} setLanguage={setLang} />
    </Group>
  );
}

function TcgPrintMetaRenderer({
  tcg,
  card,
  set,
  language,
  setLanguage,
}: {
  tcg: Tcg;
  card: TcgDataCard;
  set: TcgDataSet;
  language: string;
  setLanguage: (lang: string, printId: string) => void;
}) {
  const { t } = useTranslation('details');

  const supportedLanguages: Record<string, string> = useMemo(() => {
    return {
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
    };
  }, []);

  const printFinishes = useMemo(() => {
    if (tcg === 'mtg') {
      return (card.print as MtgDataPrint).finishes;
    }
    return [];
  }, [card.print, tcg]);

  const { thisPrintLanguages, otherPrintLanguages } = useMemo(() => {
    const printLanguages = getPrintLanguages(tcg, card.print);

    const thisPrintLanguages = printLanguages.map((l) => {
      return { label: supportedLanguages[l] ?? l, value: l };
    });
    const otherPrintLanguages = card.allPrints
      .filter((p) => p.id !== card.print.id)
      .flatMap((p) => {
        return p.supportedLanguages.map((l) => ({ language: l, printId: p.id }));
      })
      .filter((o) => !printLanguages.includes(o.language));
    const otherPrintLanguagesUniq = [
      ...new Map(
        otherPrintLanguages.map((item) => {
          return [item.language, item];
        }),
      ).values(),
    ].map((o) => ({ label: supportedLanguages[o.language] ?? o.language, value: o.language }));

    return { thisPrintLanguages, otherPrintLanguages: otherPrintLanguagesUniq };
  }, [card, supportedLanguages, tcg]);

  return (
    <Stack gap={'xs'} w={'100%'}>
      <Group gap={'xs'} wrap={'nowrap'} align={'start'} className={styles.printSummary}>
        <Link
          to={'/$tcg/sets/$setCode'}
          params={{ tcg: tcg, setCode: set.code!.toLowerCase() }}
          search={{ ...tcgSetParamsDefaults }}
          className={styles.setLink}
        >
          <TcgSetIcon tcg={tcg} setCode={set.code ?? '?'} />
        </Link>
        <Stack gap={'0.75rem'}>
          <Link
            to={'/$tcg/sets/$setCode'}
            params={{ tcg: tcg, setCode: set.code!.toLowerCase() }}
            search={{ ...tcgSetParamsDefaults }}
          >
            <Group gap={'0.5rem'} style={{ rowGap: '0' }}>
              <GourmetText c={'var(--gourmet-neutral-9)'}>{set.translations.en.name}</GourmetText>
              <GourmetText fz={'0.85rem'} c={'var(--gourmet-neutral-7)'}>
                {set.code}
              </GourmetText>
            </Group>
          </Link>

          <Group style={{ rowGap: '0.25rem' }}>
            <Group gap={'0.25rem'}>
              <IconHash size={18} color={'var(--gourmet-neutral-6)'} />
              <GourmetText size={'0.85rem'}>{card.print.collectorNumber}</GourmetText>
            </Group>

            <Group gap={'0.25rem'}>
              <IconDiamond size={18} color={'var(--gourmet-neutral-6)'} />

              <Link
                to={'/$tcg/cards'}
                params={{ tcg: tcg }}
                search={{
                  ...tcgSearchParamsDefaults,
                  query: `rarity:"${card.print.rarity}"`,
                }}
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--gourmet-blue-1)',
                  textUnderlineOffset: '2px',
                }}
              >
                <GourmetText size={'0.85rem'}>{card.print.rarity}</GourmetText>
              </Link>
            </Group>

            <Group gap={'0.25rem'}>
              <IconPlayCard size={18} color={'var(--gourmet-neutral-6)'} />
              <GourmetText size={'0.85rem'}>{printFinishes.join(', ')}</GourmetText>
            </Group>
          </Group>
        </Stack>
      </Group>

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
            group: t('meta.language.printIn'),
            items: thisPrintLanguages,
          },
          {
            group: t('meta.language.reprintIn'),
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
        renderOption={({ option, checked }) => (
          <Group flex="1" gap="xs">
            <Code>{option.value}</Code> {option.label}
            {checked && <IconCheck style={{ marginLeft: 'auto' }} size={16} />}
          </Group>
        )}
        disabled={thisPrintLanguages.length + otherPrintLanguages.length === 1}
      />
    </Stack>
  );
}

function getPrintLanguages(tcg: Tcg, print: TcgDataPrint): string[] {
  if (tcg === 'mtg') {
    const allLangs = (print as MtgDataPrint).faces.flatMap((f) => {
      return Object.keys(f.translations);
    });
    return [...new Set(allLangs)];
  }
  const elsePrint = print as Exclude<TcgDataPrint, MtgDataPrint>;
  return [...new Set(Object.keys(elsePrint.translations))];
}
