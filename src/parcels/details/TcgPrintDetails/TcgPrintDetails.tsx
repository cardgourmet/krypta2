import {Divider, Flex, Group, Stack} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {getRouteApi, useNavigate} from '@tanstack/react-router';
import {type ReactElement, useCallback} from 'react';
import type {CardDetailsSearch} from '@/parcels/details/CardDetailsSearch.ts';
import type {TcgDetailParams} from '@/parcels/details/loadTcgPrintAndSet.ts';
import {TcgPrintImageRenderer} from '@/parcels/details/TcgPrintImageRenderer.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import type {DlcDataCard, DlcDataSet} from '@/parcels/tcg/dlc/api.ts';
import type {MtgDataCard, MtgDataSet} from '@/parcels/tcg/mtg/api.ts';
import type {PcgDataCard, PcgDataSet} from '@/parcels/tcg/pcg/api.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';

export type TcgDataCard = MtgDataCard | DlcDataCard | PcgDataCard;
export type TcgDataSet = MtgDataSet | DlcDataSet | PcgDataSet;

type TcgPrintDetailsPage = {
  findParamsByLanguage: (card: TcgDataCard, lang: string) => TcgDetailParams;
  constructPageTitle: (card: TcgDataCard, set: TcgDataSet, lang: string) => ReactElement;
  constructPrintFaces: (card: TcgDataCard, lang: string) => ReactElement[];
  constructPrintMeta: (
    card: TcgDataCard,
    set: TcgDataSet,
    lang: string,
    setLanguage: (l: string, _: string) => void,
  ) => ReactElement;
};

export function TcgPrintDetails({
  findParamsByLanguage,
  constructPageTitle,
  constructPrintFaces,
  constructPrintMeta,
}: TcgPrintDetailsPage) {
  const tcg = useTcgByLocation() as Tcg;

  const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);
  const { print: cardWithPrints, set } = routeApi.useLoaderData();
  const { lang: printLanguage } = routeApi.useSearch() as CardDetailsSearch;

  const navigate = useNavigate();
  const setLanguage = useCallback(
    (lang: string, _: string) => {
      const specificParams = findParamsByLanguage(cardWithPrints, lang);

      // noinspection JSIgnoredPromiseFromCall
      navigate({
        to: `/${tcg}/sets/$setCode/$collectorNumber/{-$any}`,
        params: specificParams,
        search: (prev) => {
          return { ...prev, lang: lang } as CardDetailsSearch;
        },
      });
    },
    [navigate, cardWithPrints, tcg, findParamsByLanguage],
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
        label: cardWithPrints.name,
      },
    ],
  });

  const smallerScreen = useMediaQuery('(max-width: 1110px)');
  const smallScreen = useMediaQuery('(max-width: 950px)');
  return (
    <div>
      {constructPageTitle(cardWithPrints, set, printLanguage)}
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
        <Group justify={'space-between'} p={'0.5rem 0'}>
          <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
            {title?.label}
          </GourmetText>
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <Group justify={smallScreen ? 'center' : 'start'}>
        <Flex
          align={'start'}
          style={{ minHeight: '100vh' }}
          wrap={'nowrap'}
          direction={smallScreen ? 'column' : 'row'}
          gap={smallScreen ? '1rem' : '0.1rem'}
          w={'100%'}
          maw={smallScreen ? '26rem' : ''}
        >
          <TcgPrintImageRenderer
            tcg={tcg}
            card={cardWithPrints}
            w={smallScreen ? '100%' : ''}
            align={smallScreen ? 'center' : 'start'}
          />
          <Flex
            align={smallScreen ? 'center' : 'start'}
            wrap={'nowrap'}
            style={{ flexShrink: 10_000 }}
            direction={smallerScreen ? 'column' : 'row'}
            w={smallScreen ? '100%' : ''}
          >
            {constructPrintFaces(cardWithPrints, printLanguage).map((e, index) => {
              return (
                <Group key={index} maw={'26rem'} miw={'16rem'} align={'start'} gap={'lg'} p={'sm'}>
                  {e}
                </Group>
              );
            })}
          </Flex>
          <Group
            align={'start'}
            ml={smallScreen ? '' : 'auto'}
            maw={smallScreen ? '' : '16rem'}
            miw={'12rem'}
            mih={'32rem'}
            w={smallScreen ? '100%' : ''}
            justify={smallScreen ? 'center' : 'start'}
          >
            {constructPrintMeta(cardWithPrints, set, printLanguage, setLanguage)}
          </Group>
        </Flex>
      </Group>
    </div>
  );
}
