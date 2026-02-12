import {Divider, Flex, Group, Stack, Text} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {getRouteApi, useNavigate} from '@tanstack/react-router';
import {type ReactElement, useCallback} from 'react';
import type {CardDetailsSearch} from '@/parcels/details/CardDetailsSearch.ts';
import type {TcgDetailParams} from '@/parcels/details/loadTcgPrintAndSet.ts';
import {TcgPrintImageRenderer} from '@/parcels/details/TcgPrintImageRenderer.tsx';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import type {DlcDataCard, DlcDataSet} from '@/parcels/tcg/dlc/api.ts';
import type {MtgDataCard, MtgDataSet} from '@/parcels/tcg/mtg/api.ts';
import type {PcgDataCard, PcgDataSet} from '@/parcels/tcg/pcg/api.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './TcgPrintDetails.module.css';

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

  const routeApi = getRouteApi(`/${tcg}/sets/$setCode/$collectorNumber/{-$any}`);
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

  const smallerScreen = useMediaQuery('(max-width: 1110px)');
  const smallScreen = useMediaQuery('(max-width: 950px)');
  return (
    <div className={styles.mainContent}>
      {constructPageTitle(cardWithPrints, set, printLanguage)}
      <Stack gap={'xs'}>
        <Breadcrumbs
          subpage={''}
          moreSubpages={[
            {
              label: 'Sets',
              href: `/${tcg}/sets`,
            },
            {
              label: set.translations.en.name,
              href: `/${tcg}/sets/${set.code.toLowerCase()}`,
            },
          ]}
        />
        <Text ff={'var(--cgm-title-font-family)'} fz={'1.5rem'} fw={'bold'}>
          {cardWithPrints.name}
        </Text>
      </Stack>

      <Divider my="lg" color={'var(--gourmet-neutral-3)'} />
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
          <TcgPrintImageRenderer tcg={tcg} card={cardWithPrints} w={smallScreen ? '100%' : ''} align={'center'} />
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
