import { Center, Divider, Flex, Group, Button as MantineButton, Stack, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconAlertCircle, IconCircleCheck, IconCircleX, IconEdit, IconX } from '@tabler/icons-react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter.ts';
import type { CardDetailsSearch } from '@/parcels/details/CardDetailsSearch.ts';
import { QuickActionButtons } from '@/parcels/details/TcgPrintDetails/QuickActionButtons/QuickActionButtons.tsx';
import { TcgPrintContent } from '@/parcels/details/TcgPrintDetails/TcgPrintContent/TcgPrintContent.tsx';
import { TcgPrintDetailsContext } from '@/parcels/details/TcgPrintDetails/TcgPrintDetailsContext.tsx';
import { TcgPrintMeta } from '@/parcels/details/TcgPrintDetails/TcgPrintMeta/TcgPrintMeta.tsx';
import { TcgPrintImageRenderer } from '@/parcels/details/TcgPrintImageRenderer.tsx';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { slugify } from '@/parcels/slugify.ts';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';
import type { DlcDataPrint } from '@/parcels/tcg/dlc/api.ts';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg.ts';
import { getTranslatedName } from '@/parcels/tcg/helpers.ts';
import type { MtgDataCard, MtgDataPrint } from '@/parcels/tcg/mtg/api.ts';
import { renderRichMtgText } from '@/parcels/tcg/mtg/renderRichMtgText.tsx';
import type { PcgDataPrint } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataPrint } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './TcgPrintDetails.module.css';

export function TcgPrintDetails() {
  const tcg = useTcgByLocation() as Tcg;

  const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);
  const { print: card, set } = routeApi.useLoaderData();
  const { lang: printLanguage } = routeApi.useSearch() as CardDetailsSearch;

  const navigate = useNavigate();
  const setLanguage = useCallback(
    (lang: string, _: string) => {
      const thisPrint = card.print as TcgDataPrint;
      let specificPrint = thisPrint as TcgDataPrint;

      if (tcg === 'mtg') {
        const p = thisPrint as MtgDataPrint;

        if (!p.supportedLanguages.includes(lang)) {
          specificPrint = (card.allPrints.find((print) => print.supportedLanguages.includes(lang))
            ?? thisPrint) as TcgDataPrint;
        }
      } else if (tcg === 'pcg') {
        const p = thisPrint as PcgDataPrint;

        if (Object.keys(p.translations).includes(lang)) {
          specificPrint = (card.allPrints.find((print) => print.supportedLanguages.includes(lang))
            ?? thisPrint) as TcgDataPrint;
        }
      } else if (tcg === 'dlc') {
        const p = thisPrint as DlcDataPrint;

        if (Object.keys(p.translations).includes(lang)) {
          specificPrint = (card.allPrints.find((print) => print.supportedLanguages.includes(lang))
            ?? thisPrint) as TcgDataPrint;
        }
      }

      const specificParams = {
        setCode: specificPrint.setCode?.toLowerCase(),
        collectorNumber: specificPrint.collectorNumber.toLowerCase(),
        any: slugify(card.name),
      };

      let newLanguage: string | undefined = lang;
      if (lang === 'en') newLanguage = undefined;

      // noinspection JSIgnoredPromiseFromCall
      navigate({
        to: `/${tcg}/sets/$setCode/$collectorNumber/{-$any}`,
        params: specificParams,
        search: (prev) => {
          return { ...prev, lang: newLanguage } as CardDetailsSearch;
        },
      });
    },
    [navigate, card, tcg],
  );

  const { component, title } = useBreadcrumbs({
    subpage: '',
    moreSubpages: [
      {
        label: 'Sets',
        href: `/${tcg}/sets`,
      },
      {
        label: set.translations.en.name,
        href: `/${tcg}/sets/${set.code.toLowerCase()}`,
      },
      {
        label: getTranslatedName(tcg, card, printLanguage),
      },
    ],
  });

  const legalities: Legality[] = useMemo(() => {
    if (tcg === 'mtg') {
      const c = card as MtgDataCard;

      return Object.entries(c.print.legalities).map(([format, status]) => {
        return { format: format, status: status } as Legality;
      });
    }
    return [];
  }, [card, tcg]);
  const rulings: { date: string; text: string }[] = useMemo(() => {
    if (tcg === 'mtg') {
      const c = card as MtgDataCard;

      return c.rulings;
    }
    return [];
  }, [card, tcg]);

  const smallScreen = useMediaQuery('(max-width: 950px)');
  return (
    <TcgPrintDetailsContext value={{ lang: printLanguage }}>
      <div>
        <title>{`${card.name} (${set.translations?.en?.name} #${card.print.collectorNumber}) – ${getNameByTcg(tcg)} – Cardgourmet`}</title>
        {component}

        <Stack
          gap={'0'}
          style={{
            position: 'sticky',
            top: 'var(--navbar-height)',
            zIndex: 'var(--sticky-layer)',
            backgroundColor: 'var(--gourmet-neutral-0)',
          }}
          mb={'1rem'}
        >
          <Group justify={'space-between'} p={'0.5rem 0'} h={'3.5rem'}>
            <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
              {title?.label}
            </GourmetText>

            <QuickActionButtons />
          </Group>
          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
        </Stack>

        <ForwardedToDetailsBanner />

        <Group justify={smallScreen ? 'center' : 'start'}>
          <Flex
            align={'start'}
            wrap={'nowrap'}
            direction={smallScreen ? 'column' : 'row'}
            gap={smallScreen ? '1rem' : '0.1rem'}
            w={'100%'}
            maw={smallScreen ? '26rem' : ''}
          >
            <TcgPrintImageRenderer
              tcg={tcg}
              card={card}
              w={smallScreen ? '100%' : ''}
              align={smallScreen ? 'center' : 'start'}
              lang={printLanguage}
            />

            <TcgPrintContent tcg={tcg} card={card} />

            <TcgPrintMeta tcg={tcg} card={card} set={set} lang={printLanguage} setLang={setLanguage} />
          </Flex>
        </Group>

        <Group wrap={'nowrap'} align={'start'}>
          {legalities.length > 0 && <LegalityDisplay legalities={legalities} />}

          {rulings.length > 0 && <RulingsDisplay rulings={rulings} />}
        </Group>
      </div>
    </TcgPrintDetailsContext>
  );
}

function ForwardedToDetailsBanner() {
  const wasForwarded = useLocalUserStateStore((state) => state.wasDetailsForwarded);
  const { user } = useAuth();

  return (
    <>
      {wasForwarded && user?.settings?.search?.forwardToDetailPage && (
        <Stack
          w={'65%'}
          p={'1rem 1rem'}
          style={{
            backgroundColor: 'var(--gourmet-blue-1)',
            borderRadius: '0.25rem',
            position: 'relative',
          }}
          mb={'1rem'}
        >
          <UnstyledButton
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
            }}
          >
            <Center>
              <IconX size={18} color={'var(--gourmet-neutral-1)'} />
            </Center>
          </UnstyledButton>

          <Stack gap={'0.25rem'}>
            <GourmetText cgmc={'neutral-1'}>
              We have forwarded you to the details page, since your search resulted in only one card or print.
            </GourmetText>
            <GourmetText cgmc={'neutral-1'}>
              Do you want us to continue doing so? You can change your decision in your settings any time.
            </GourmetText>
          </Stack>

          <Group justify={'end'} gap={'0.5rem'}>
            <MantineButton color={'var(--gourmet-neutral-4)'}>Disable it</MantineButton>
            <MantineButton color={'var(--gourmet-neutral-2)'}>Keep forwarding</MantineButton>
          </Group>
        </Stack>
      )}
    </>
  );
}

function RulingsDisplay({ rulings }: { rulings: { date: string; text: string }[] }) {
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
        {rulings.map((r) => {
          return (
            <Stack key={r.date} gap={'0'}>
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

type Legality = {
  format: string;
  status: 'legal' | 'restricted' | 'banned';
};

function LegalityDisplay({ legalities }: { legalities: Legality[] }) {
  return (
    <Stack maw={'28rem'} gap={'0.25rem'}>
      <Center>
        <GourmetText cgmff={'title'} fz={'1.25rem'} fw={500}>
          Legalities
        </GourmetText>
      </Center>

      <Stack
        gap={'0.25rem'}
        h={'20rem'}
        style={{
          border: '1px solid var(--gourmet-neutral-3)',
          borderRadius: '0.5rem',
          padding: '1rem 1.5rem',
        }}
        justify={'space-between'}
      >
        <Group style={{ rowGap: '0.5rem' }}>
          {legalities
            .sort((a, b) => a.format.localeCompare(b.format))
            .map((l, i) => {
              return (
                <div key={i} className={styles.legality}>
                  <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fz={'0.95rem'} className={styles.legalityPill}>
                    {capitalizeFirstLetter(l.format)}
                  </GourmetText>
                  {l.status === 'legal' && <IconCircleCheck color={'var(--gourmet-green-1)'} />}
                  {l.status === 'restricted' && <IconAlertCircle color={'var(--gourmet-orange-01)'} />}
                  {l.status === 'banned' && <IconCircleX color={'var(--gourmet-red-01)'} />}
                </div>
              );
            })}
        </Group>
        <Stack gap={'0'}>
          <GourmetText cgmff={'ui'}>Everything not listed here is not legal by default.</GourmetText>

          <Button
            accent="brand"
            size="sm"
            leadingIcon={<IconEdit />}
            variant="tertiary"
            onClick={() => {
              // TODO: open menu to edit displayed formats
            }}
          >
            <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'}>
              Edit displayed formats
            </GourmetText>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
