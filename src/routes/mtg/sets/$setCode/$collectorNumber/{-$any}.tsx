import {Divider, Flex, Group, Stack, Text} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {createFileRoute, stripSearchParams, useNavigate} from '@tanstack/react-router';
import {useCallback} from 'react';
import {z} from 'zod';
import {loadTcgPrintAndSet} from '@/parcels/details/loadTcgPrintAndSet.ts';
import {TcgPrintImageRenderer} from '@/parcels/details/TcgPrintImageRenderer.tsx';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import {slugify} from '@/parcels/slugify.ts';
import {MtgPrintFaceContentRenderer} from '@/parcels/tcg/mtg/details/MtgPrintFaceContentRenderer.tsx';
import {MtgPrintMetaRenderer} from '@/parcels/tcg/mtg/details/MtgPrintMetaRenderer/MtgPrintMetaRenderer.tsx';
import styles from './{-$any}.module.css';

const cardDetailDefaults = { lang: 'en' };
const cardDetailSearchSchema = z.object({
  lang: z.string().default(cardDetailDefaults.lang),
});
type CardDetailsSearch = z.infer<typeof cardDetailSearchSchema>;

export const Route = createFileRoute('/mtg/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  validateSearch: cardDetailSearchSchema,
  search: {
    middlewares: [stripSearchParams(cardDetailDefaults)],
  },
  loader: async ({ params }) => {
    return loadTcgPrintAndSet('mtg', params);
  },
});

function RouteComponent() {
  const { print: cardWithPrints, set } = Route.useLoaderData();
  const { lang } = Route.useSearch() as CardDetailsSearch;
  const frontFace = cardWithPrints.print.faces[0];
  const backFace = cardWithPrints.print.faces[1];

  const navigate = useNavigate();
  const setLanguage = useCallback(
    (lang: string, _: string) => {
      const specificPrint =
        cardWithPrints.allPrints.find((print) => print.supportedLanguages.includes(lang)) ?? cardWithPrints.print;

      // noinspection JSIgnoredPromiseFromCall
      navigate({
        to: Route.to,
        params: {
          setCode: specificPrint.setCode.toLowerCase(),
          collectorNumber: specificPrint.collectorNumber.toLowerCase(),
          any: slugify(cardWithPrints.name),
        },
        search: (prev) => {
          return { ...prev, lang: lang } as CardDetailsSearch;
        },
      });
    },
    [navigate, cardWithPrints],
  );

  const smallerScreen = useMediaQuery('(max-width: 1110px)');
  const smallScreen = useMediaQuery('(max-width: 950px)');

  return (
    <div className={styles.mainContent}>
      <title>{`${cardWithPrints.name} (${set.translations?.en?.name} #${cardWithPrints.print.collectorNumber}) – Magic: The Gathering – Cardgourmet`}</title>
      <Stack gap={'xs'}>
        <Breadcrumbs
          subpage={''}
          moreSubpages={[
            {
              label: 'Sets',
              href: `/mtg/sets`,
            },
            {
              label: set.translations.en.name,
              href: `/mtg/sets/${set.code.toLowerCase()}`,
            },
          ]}
        />
        <Text ff={'var(--cgm-title-font-family)'} fz={'1.5rem'} fw={'bold'}>
          {cardWithPrints.name}
        </Text>
      </Stack>

      <Divider my="lg" color={'var(--gourmet-neutral-3)'} />
      <Group justify={'center'}>
        <Flex
          align={'start'}
          style={{ minHeight: '100vh' }}
          wrap={'nowrap'}
          direction={smallScreen ? 'column' : 'row'}
          gap={smallScreen ? '1rem' : '0.1rem'}
          maw={smallScreen ? '26rem' : ''}
        >
          <TcgPrintImageRenderer tcg={'mtg'} card={cardWithPrints} w={smallScreen ? '100%' : ''} align={'center'} />
          <Flex
            align={smallScreen ? 'center' : 'start'}
            wrap={'nowrap'}
            style={{ flexShrink: 10_000 }}
            direction={smallerScreen ? 'column' : 'row'}
            w={smallScreen ? '100%' : ''}
          >
            <MtgPrintFaceContentRenderer
              print={frontFace}
              maw={'26rem'}
              miw={'16rem'}
              align={'start'}
              gap={'lg'}
              p={'sm'}
            />
            {backFace && (
              <MtgPrintFaceContentRenderer
                print={backFace}
                maw={'26rem'}
                miw={'16rem'}
                align={'start'}
                gap={'lg'}
                p={'sm'}
              />
            )}
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
            <MtgPrintMetaRenderer
              card={cardWithPrints}
              print={cardWithPrints.print}
              set={set}
              language={lang}
              setLanguage={setLanguage}
            />
          </Group>
        </Flex>
      </Group>
    </div>
  );
}
