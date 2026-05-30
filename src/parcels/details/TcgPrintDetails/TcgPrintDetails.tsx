import { Divider, Flex, Group, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { CardDetailsSearch } from '@/parcels/details/CardDetailsSearch.ts';
import { QuickActionButtons } from '@/parcels/details/TcgPrintDetails/QuickActionButtons/QuickActionButtons.tsx';
import { TcgPrintContent } from '@/parcels/details/TcgPrintDetails/TcgPrintContent/TcgPrintContent.tsx';
import { TcgPrintDetailsContext } from '@/parcels/details/TcgPrintDetails/TcgPrintDetailsContext.tsx';
import { TcgPrintMeta } from '@/parcels/details/TcgPrintDetails/TcgPrintMeta/TcgPrintMeta.tsx';
import { TcgPrintImageRenderer } from '@/parcels/details/TcgPrintImageRenderer.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { slugify } from '@/parcels/slugify.ts';
import type { DlcDataPrint } from '@/parcels/tcg/dlc/api.ts';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg.ts';
import { getTranslatedName } from '@/parcels/tcg/helpers.ts';
import type { MtgDataPrint } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataPrint } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataPrint } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

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

        <Stack>
          <pre style={{ wordBreak: 'break-all', overflow: 'hidden' }}>{JSON.stringify(card, null, 2)}</pre>
        </Stack>
      </div>
    </TcgPrintDetailsContext>
  );
}
