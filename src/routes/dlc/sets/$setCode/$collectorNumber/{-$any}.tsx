import {Divider, Group, Stack, Text} from '@mantine/core';
import {createFileRoute, notFound, redirect, stripSearchParams, useNavigate} from '@tanstack/react-router';
import {useCallback} from 'react';
import {z} from 'zod';
import {TcgPrintImageRenderer} from '@/parcels/details/TcgPrintImageRenderer.tsx';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs.tsx';
import {slugify} from '@/parcels/slugify.ts';
import {type DlcDataCard, type DlcDataSet, fetchDlcPrint, fetchDlcSet} from '@/parcels/tcg/dlc/api.ts';
import {DlcPrintContentRenderer} from '@/parcels/tcg/dlc/details/DlcPrintContentRenderer/DlcPrintContentRenderer.tsx';
import {DlcPrintMetaRenderer} from '@/parcels/tcg/dlc/details/DlcPrintMetaRenderer/DlcPrintMetaRenderer.tsx';
import styles from './{-$any}.module.css';

const cardDetailDefaults = { lang: 'en' };
const cardDetailSearchSchema = z.object({
  lang: z.string().default(cardDetailDefaults.lang),
});
type CardDetailsSearch = z.infer<typeof cardDetailSearchSchema>;

export const Route = createFileRoute('/dlc/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  validateSearch: cardDetailSearchSchema,
  search: {
    middlewares: [stripSearchParams(cardDetailDefaults)],
  },
  loader: async ({ params }) => {
    const res = await fetchDlcPrint(params.setCode, params.collectorNumber);
    if (!res.data) {
      console.log('Could not fetch print', res);
      throw notFound();
    }
    const cardWithPrints = res.data;
    if (!cardWithPrints) {
      throw notFound();
    }
    const slug = slugify(cardWithPrints.name);
    if (params.any !== slug) {
      throw redirect({
        to: Route.to,
        params: {
          setCode: params.setCode.toLowerCase(),
          collectorNumber: params.collectorNumber.toLowerCase(),
          any: slug,
        },
        replace: true,
      });
    }

    const res2 = await fetchDlcSet(cardWithPrints.print.setId);
    if (!res2.data) {
      console.log('Could not fetch set', res2);
      throw notFound();
    }
    const printSet = res2.data;
    if (!printSet) {
      throw notFound();
    }

    return {
      print: cardWithPrints as DlcDataCard,
      set: printSet as DlcDataSet,
    };
  },
});

function RouteComponent() {
  const { print: cardWithPrints, set } = Route.useLoaderData();
  const { lang } = Route.useSearch() as CardDetailsSearch;

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

  return (
    <div className={styles.mainContent}>
      <title>{`${cardWithPrints.name} (${set.translations?.en?.name} #${cardWithPrints.print.collectorNumber}) – Disney Lorcana – Cardgourmet`}</title>
      <Stack gap={'xs'}>
        <Breadcrumbs
          subpage={''}
          moreSubpages={[
            {
              label: 'Sets',
              href: `/dlc/sets`,
            },
            {
              label: set.translations.en.name,
              href: `/dlc/sets/${set.code.toLowerCase()}`,
            },
          ]}
        />
        <Text ff={'var(--cgm-title-font-family)'} fz={'1.5rem'} fw={'bold'}>
          {cardWithPrints.name}
        </Text>
      </Stack>

      <Divider my="lg" color={'var(--gourmet-neutral-3)'} />

      <Group align={'start'} style={{ minHeight: '100vh' }}>
        <TcgPrintImageRenderer tcg={'dlc'} card={cardWithPrints} />

        <DlcPrintContentRenderer card={cardWithPrints} print={cardWithPrints.print} lang={lang} />
        <DlcPrintMetaRenderer
          tcg={'dlc'}
          card={cardWithPrints}
          print={cardWithPrints.print}
          set={set}
          language={lang}
          setLanguage={setLanguage}
        />
      </Group>

      <p style={{ wordWrap: 'break-word' }}>{JSON.stringify(cardWithPrints)}</p>
      <p style={{ wordWrap: 'break-word' }}>{JSON.stringify(set)}</p>
    </div>
  );
}
